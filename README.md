# feature-with-flags

feature-with-flags is a typescript library to implement feature flags for javascript applications. Name inspired from Sheldon Coopers fun with flags program.

## What are feature flags?

Feature flags (also commonly known as feature toggles) are a software engineering technique that turns select functionality on and off during runtime, without deploying new code.




## Installation

Install the package using npm or yarn by

```bash

npm install --save feature-with-flags

or

yarn add feature-with-flags

```


## Usage

```javscript

# ES6

import FeatureFlag from "feature-with-flags";

# CommonJs

const FeatureFlag = require('feature-with-flags');

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

In this section, we will discuss the internals of feature-with-flags library.
#### Feature Flag Configurations Object


feature-with-flags expects feature flag configurations object in the below shape

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
   roles: ['ROLE_1', 'ROLE_2']
  },
  featureFlag2: {
    enable: false,
    activationStrategies: "UserWithIDActivationStrategy",
    userIDs: ['USER_ID_1', 'abc', 'xyz'],
  },
   .... other feature flags
 }
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
  userRole: 'LOGGED_IN_USER_ROLE' //feature-with-flags will take this key and lookover the userRoles provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### UserWithIDActivationStrategy

ActivationStrategy implementation based on the ID of the current user. As far as the user has at least one of configured IDs then the feature will be active.

#### Usage

##### Configuration:

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
  userID: 'LOGGED_IN_USER_ID' //feature-with-flags will take this key and lookover the userIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### RegionActivationStrategy

ActivationStrategy implementation based on the region of the current user. As far as the user has at least one of configured regions then the feature will be active.

#### Usage

##### Configuration:

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
  region: 'USER_REGION' //feature-with-flags will take this key and lookover the regions provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### DeviceTypeActivationStrategy

ActivationStrategy implementation based on the device type of the current user. As far as the user has at least one of configured device types then the feature will be active.

#### Usage

##### Configuration:

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
  deviceType: navigator.userAgent //feature-with-flags will take this key and lookover the deviceTypes provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```


### TenantActivationStrategy

ActivationStrategy implementation based on the tenant id of the current user. As far as the user has at least one of configured tenant ids then the feature will be active.

#### Usage

##### Configuration:
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
  tenantID: "TENANT_ID //feature-with-flags will take this key and lookover the tenantIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### ClientIdActivationStrategy

ActivationStrategy implementation based on the client id of the current user. As far as the user has at least one of configured client ids then the feature will be active.

#### Usage

##### Configuration:

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
  clientID: "CLIENT_ID //feature-with-flags will take this key and lookover the clientIDs provided in the configuration.
 }
 const { status, message } = isActive("alpha", featureFlagContext);
```

### ReleaseDateActivationStrategy

ActivationStrategy implementation based on the release date. When the current date is beyond or equal to the user provided release date then the feature will be active.

#### Usage

##### Configuration:

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

If you want to enable a feature for a fixed percentage of users randomly, you need to pass the percentage range (0 -100) and a unique identifier for each logged in user typically userID. Internally feature-with-flags calculates user threshold value (a unique number that is always the same based on feature flag name & unique user id) check with rolloutPercentage, if the user threshold value is less than rolloutPercentage then the feature will be active

#### Usage

##### Configuration:

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

If the user didn't pass any activation strategy, feature-with-flags consider it as default activation strategy, the status of this feature flag will be depend on the `enabled` key.

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

In this section, you will find all the types of messages feature-with-flags will send to the user when there is an error. This will help the developer to debug why the feature flag is not working as expected.



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

Contact @Manoj Kumar Gangavarapu (manoj.gangavarapuu@gmail.com) in case of any queries.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
