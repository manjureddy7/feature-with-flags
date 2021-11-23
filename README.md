# Flagger4j

Flagger4j is a typescript library to implement feature flags for javascript applications.

## What are feature flags?

Feature flags (also commonly known as feature toggles) are a software engineering technique that turns select functionality on and off during runtime, without deploying new code.




## Installation

Install the package using npm or yarn by

```bash

npm install --save @walmartlabs/flagger4j

or

yarn add @walmartlabs/flagger4j

```


## Usage

```javscript

# ES6

import FeatureFlag from "@walmartlabs/flagger4j";

# CommonJs

const FeatureFlag = require('@walmartlabs/flagger4j');

```

Initialise FeatureFlag and pass feature flag configuration to it

```javascript
const featureFlags = new FeatureFlag(FEATURE_FLAGS_CONFIGURATION);

const { isActive } = featureFlags();

```

You can get the status of a feature flag by passing some of its details to the isActive method

```javascript

const { status, message } = isActive(FEATURE_FLAG_DETAILS);

```

status is a boolean which tells if a feature flag is enabled or not

message is a null | string, a message if there's wrong with the passed in feature flag details

```javascript
# enable a feature by

if(status) {
  useNewLogic();
} else {
  useExistingLogic();
}

```
## Internals

In this section, we will discuss the internals of Flagger4j library.
#### Feature Flag Configurations Object

Flagger4j accepts two types of objects as parameters at the time of initialization.

Type1: Normal configuration Object

Type2: Configuration from CCM2


#### Type 1: normal configuration object

Flagger4j expects feature flag configurations object in the below shape

 - Sample configuration
```javascript
  
 const featureFlagConfigurations = {
  featureFlag1: {
   enable: true
  },
  featureFlag2: {
   enable: false
  }
 }
```

 - Complex configuration
```javascript
  
 const featureFlagConfigurations = {
  featureFlag1: {
   enable: true,
   activationStrategies: ['UserRoleActivationStrategy', 'ReleaseDateActivationStrategy'],
   roles: ['REP_US_RSCPM', 'REP_US_PET']
  },
  featureFlag2: {
    enable: false,
    activationStrategies: "UserWithIDActivationStrategy",
    userIDs: ['m0k05u9', 'abc', 'xyz'],
  },
   .... other feature flags
 }
```

#### Type 2: based on CCM2 configurations
 We suggest creating below like shape under configDefinitions in your ccm.yml file

``` yaml
# Sample example

configDefinitions:
 "featureFlagsConfiguration": # This is the name of your feature flag configuration, can be anything
    description: "My whole APP level feature flags live here" # description for the confi, can be anything
    properties:
    beta: # Name of the feature flag
        description: "This feature will decide whether enable beta version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues: # Here you pass all the information related to the feature flag
          - "enable: true"
        
```

``` yaml
# Complex example with two or more feature flags and activation strategies
## We will talk more about the activation strategies in the below section don't worry for now

configDefinitions:
 "featureFlagsConfiguration": # This is the name of your feature flag configuration, can be anything
    description: "My whole APP level feature flags live here" # description for the confi, can be anything
    properties:
      beta: # Name of the feature flag
        description: "This feature will decide whether enable beta version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues: # Here you pass all the information related to the feature flag
          - "enable: true"

       alpha: # Name of the feature flag
        description: "This flag enables alpha version of the APP to the consumers"
        type: "STRING"
        kind: "MULTI"
        defaultValues: 
          - "enable: true"
          - "activationStrategies: UserRoleActivationStrategy, ReleaseDateActivationStrategy" # dependent stratigies
          - "userRoles: admin, prime" # This flag will be enabled only for these roles
          - "releaseDate: 11/24/2022" # This should be release on or after this date (MM/DD/YYYY)
        
```

Now the above complex example from CCM2 will look like below in your frontend apps

```javascript

configData: {
  featureFlagConfig: {
   "alpha":[
         "enable: true",
         "activationStrategies: UserRoleActivationStrategy, ReleaseDateActivationStrategy",
          "userRoles: admin, phoenix",
          "releaseDate: 11/24/2022"
     ],
    "beta":[
         "enable: true"
    ],
  }
}

```

Now pass the above featureFlagConfig to the flagger4j library

```javascript

## featureFlagConfig is config data from CCM2

const featureFlagConfig = new FeatureFlag(featureFlagConfig);

## Internally flagger4j library works on the shape of above passed in the config and converts it to the below shape

{
  alpha: {
    enable: true,
    activationStrategies: ["UserRoleActivationStrategy", "ReleaseDateActivationStrategy"],
    userRoles:["admin", "phoenix"],
    releaseDate: "11/24/2022"
  },
  beta:{
   enable: true
  }
}

```

Now check the status of the feature flag as shown below

```javascript
const { isActive } = featureFlagConfig;

## Check the status feature flag beta

const { status, message } = isActive("beta") // Name of the feature flag to test

## status will be true, since the beta feature flag has 'enabled' value as true
## message will be null, since there is no error happened

```


The above sample code is for feature flags which are very straightforward just read the enable key value, but there are scenarios where you want the feature flag to be more granular, more tuned

```javascript

const { isActive } = featureFlagConfig;

## Check the status feature flag alpha

// This is a little complex since alpha is not as straightforward as beta. Alpha feature flag is more granular
// ie it has some more extra data like activationStrategies in place (more about activation strategies in the below sections)
// for the feature flags which are granular or which has activation strategies 

// Flagger4j expects a second parameter called featureFlagContext to the isActive method

// NOTE: The keys of featureFlagContext 'CANT' be any, each activation strategy requires one/more specif key in the context
const featureFlagAlphaContext = {
 userRole: "admin" // You can read more about the 'keys' in below sections
};
const { status, message } = isActive("alpha");

## Now internally flagger4j, looks at the activation strategies, config and context and returns the status & message

## status will be true, since the alpha feature flag context(userRole='admin') is present in the config userRoles 
## message will be null, since there is no error happened

```

```javascript
## When the context object and config mismatches

const featureFlagAlphaContext = {
 userRole: "tenant"
};

const { status, message } = isActive("alpha");

## status will be false, since the alpha feature flag context(userRole=tenant) is not matched with the userRoles in config()
## message will be `userRole: tenant is not found in userRoles, please check your configuration`

```

#### Examples of feature flags which are very granual

- Show the feature only for users who has `ADMIN` role
- Enable the feature for just `US` region
- This feature will be shown only at specific `date`
- and many more.....

You see the list goes on.



## Activation Stratigies

### UserRoleActivationStrategy

ActivationStrategy implementation based on roles of the current user. As far as the user has at least one of configured roles then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: UserRoleActivationStrategy"
          - "userRoles: admin, prime" # This key is must a provided for as UserRoleActivationStrategy looks for userRoles in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["UserRoleActivationStrategy"],
    userRoles:["admin", "phoenix"], //This key is must a provided for as UserRoleActivationStrategy looks for userRoles in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains UserRoleActivationStrategy then the end user needs to pass the key `userRole` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  userRole: 'LOGGED_IN_USER_ROLE' //flagger4j will take this key and lookover the userRoles provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### UserWithIDActivationStrategy

ActivationStrategy implementation based on the ID of the current user. As far as the user has at least one of configured IDs then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: UserWithIDActivationStrategy"
          - "userIDs: ID1, ID2" # This key is must a provided for as UserWithIDActivationStrategy looks for userIDs in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["UserWithIDActivationStrategy"],
    userIDs:["ID1", "ID2"], //This key is must a provided for as UserWithIDActivationStrategy looks for userIDs in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains UserWithIDActivationStrategy then the end user needs to pass the key `userID` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  userID: 'LOGGED_IN_USER_ID' //flagger4j will take this key and lookover the userIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### RegionActivationStrategy

ActivationStrategy implementation based on the region of the current user. As far as the user has at least one of configured regions then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: RegionActivationStrategy"
          - "regions: region1, region2" # This key is must a provided for as RegionActivationStrategy looks for userID in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["RegionActivationStrategy"],
    regions:["region1", "region2"], //This key is must a provided for as RegionActivationStrategy looks for regions in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains RegionActivationStrategy then the end user needs to pass the key `region` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  region: 'USER_REGION' //flagger4j will take this key and lookover the regions provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### DeviceTypeActivationStrategy

ActivationStrategy implementation based on the device type of the current user. As far as the user has at least one of configured device types then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: DeviceTypeActivationStrategy"
          - "deviceTypes: desktop, mobile" # This key is must a provided for as DeviceTypeActivationStrategy looks for deviceTypes in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["DeviceTypeActivationStrategy"],
    deviceTypes:["desktop", "mobile"], // This key is must a provided for as DeviceTypeActivationStrategy looks for deviceTypes in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains DeviceTypeActivationStrategy then the end user needs to pass the key `deviceType` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  deviceType: navigator.userAgent //flagger4j will take this key and lookover the deviceTypes provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```


### TenantActivationStrategy

ActivationStrategy implementation based on the tenant id of the current user. As far as the user has at least one of configured tenant ids then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: TenantActivationStrategy"
          - "tenantIDs: tenant1, tenant2" # This key is must a provided for as TenantActivationStrategy looks for tennatIDs in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["TenantActivationStrategy"],
    tenantIDs:["tenant1", "tenant2"], // This key is must a provided for as TenantActivationStrategy looks for tenantIDs in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains TenantActivationStrategy then the end user needs to pass the key `tenantID` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  tenantID: "TENANT_ID //flagger4j will take this key and lookover the tenantIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### ClientIdActivationStrategy

ActivationStrategy implementation based on the client id of the current user. As far as the user has at least one of configured client ids then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: ClientIdActivationStrategy"
          - "clientIDs: client1, client2" # This key is must a provided for as ClientIdActivationStrategy looks for clientIDs in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["ClientIdActivationStrategy"],
    clientIDs:["client1", "client2"], // This key is must a provided for as ClientIdActivationStrategy looks for clientIDs in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains ClientIdActivationStrategy then the end user needs to pass the key `clientID` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  clientID: "CLIENT_ID //flagger4j will take this key and lookover the clientIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### ReleaseDateActivationStrategy

ActivationStrategy implementation based on the release date. When the current date is beyond or equal to the user provided release date then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: ReleaseDateActivationStrategy"
          - "releaseDate: November 21, 2021" # Note: releaseDate should be in this format. This key is must a provided for as ReleaseDateActivationStrategy looks for releaseDate in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["ReleaseDateActivationStrategy"],
    releaseDate: "November 21, 2021, // Note: releaseDate should be in this format. This key is must a provided for as ReleaseDateActivationStrategy looks for releaseDate in the config,
    .... other configurations
  },
}
   
```

##### Context:

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const { status, message } = isActive("alpha");
```

### DateTimeActivationStrategy

ActivationStrategy implementation based on the release date with time. When the current date is beyond or equal to the user provided release date then the feature will be active.

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: DateTimeActivationStrategy"
          # Format: DD/MM/YYY/HOURS:MINUTES:SECONDS
          - "releaseDateWithTime: 11/11/2021/16:50:10"
          # Note: releaseDateWithTime should be in this format. This key is must a provided for as DateTimeActivationStrategy looks for releaseDateWithTime in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["DateTimeActivationStrategy"],
    // Format: DD/MM/YYY/HOURS:MINUTES:SECONDS
    releaseDateWithTime: "11/11/2021/16:50:10, // Note: releaseDateWithTime should be in this format. This key is must a provided for as DateTimeActivationStrategy looks for releaseDateWithTime in the config,
    .... other configurations
  },
}
   
```

##### Context:

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const { status, message } = isActive("alpha");
```


### FlexibleRolloutActivationStrategy

ActivationStrategy implementation based on the unique id of the current user. As far as the user threshold value is within the range of user provided rolloutPercentage then the feature will be active.

How does this strategy work?

If you want to enable a feature for a fixed percentage of users randomly, you need to pass the percentage range (0 -100) and a unique identifier for each logged in user typically userID. Internally flagger4j calculates user threshold value (a unique number that is always the same based on feature flag name & unique user id) check with rolloutPercentage, if the user threshold value is less than rolloutPercentage then the feature will be active

#### Usage

##### Configuration:
###### - If using CCM2 to pass configuration

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
          - "activationStrategies: FlexibleRolloutActivationStrategy"
          - "rolloutPercentage: 40" # This key is must a provided for as FlexibleRolloutActivationStrategy looks for rolloutPercentage in the config
          - ....other configurations
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true,
    activationStrategies: ["FlexibleRolloutActivationStrategy"],
    rolloutPercentage: 40, // This key is must a provided for as FlexibleRolloutActivationStrategy looks for rolloutPercentage in the config,
    .... other configurations
  },
}
   
```

##### Context:

When the featureFlag contains FlexibleRolloutActivationStrategy then the end user needs to pass a unique identifier `userID` while checking the status.

```javascript
 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;
 const featureFlagContext = {
  // This is a must provided key
  userID: "ANY_UNIQUE_IDENTIFIER_ACROSS_USERS"
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```


### default

If the user didn't pass any activation strategy, flagger4j consider it as default activation strategy, the status of this feature flag will be depend on the `enabled` key.

```yaml
# sample example

configDefinitions:
 "featureFlagsConfiguration":
    description: "My whole APP level feature flags live here
    properties:
    alpha: # Name of the feature flag
        description: "This feature will decide whether enable alpha version to the end users"
        type: "STRING"
        kind: "MULTI"
        defaultValues:
          - "enable: true"
   
```

###### - If using normal configuration

```javascript
# sample example

featureFlagConfigurations: {
  alpha: { // Name of the feature flag
    enable: true
  },
}
   
```

##### Context:

```javascript

 const featureFlagConfig = new FeatureFlag("YOUR_FEATURE_FLAG_CONFIGURATION");
 const { isActive } = featureFlagConfig;

 const { status, message } = isActive("alpha");
```


## Generic error messages

In this section, you will find all the types of messages flagger4j will send to the user when there is an error. This will help the developer to debug why the feature flag is not working as expected.



```javascript

## When the user passes a feature flag name that is not part of his/her feature flag configuration

message: feature flag name: FEATURE_FLAG_NAME is not found, please check your configuration.

## In the above Activation Strategies section you will find the required key in config & context for each strategy

// Case 1: If the user didn't pass or misspells the required CONFIG key for the activation strategy

Message: `Activation strategy: ${YOUR_STRATEGY_NAME} missing lookup ${REQUIRED_STRATEGY_CONFIG_KEY} in the config for feature flag: ${YOUR_FEATURE_FLAG_NAME}`

// Case 2: If the user didn't pass or misspells the required CONTEXT key for the activation strategy

Message: `Activation strategy: ${YOUR_STRATEGY_NAME} missing lookup ${REQUIRED_STRATEGY_CONTEXT_KEY} in the context for feature flag: ${YOUR_FEATURE_FLAG_NAME}`

// Case 3: If the user didn't pass or misspells the required CONFIG & CONTEXT key for the activation strategy

Message: `Activation strategy: ${YOUR_STRATEGY_NAME} requires ${REQUIRED_STRATEGY_CONFIG_KEY} in the config object and ${REQUIRED_STRATEGY_CONTEXT_KEY} in the context object as lookup for feature flag: ${YOUR_FEATURE_FLAG_NAME}`

// Case 4: When the user passes a feature flag name that is not present in the configuration

Message: `feature flag name: ${YOUR_FEATURE_FLAG_NAME} is not found, please check the configuration`

// Case 5: When the user passed context key value not matched with the value of configuration for an activation strategy

Message: `${CONTEXT_VALUE} is not found in ${CONFIG_KEYS}` 

Ex: userId: 123 is not found in userID's configuration

```

## Contact

Contact @Manoj Kumar Gangavarapu (manoj.kumar1@walmart.com) in case of any queries.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
