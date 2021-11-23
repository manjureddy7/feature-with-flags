import transformEnableProp from "./transformEnableProp";

/**
 * This method will trim and remove the empty spaces from the passed in configValues
 * @param configValues 
 * @returns 
 */
const trimAndRemoveSpacesFromConfig = (configValues: string[]) => {
    const response = configValues.join(",").trim().replace(/ /g,'').split(",");
    return transformEnableProp(response)
};

export default trimAndRemoveSpacesFromConfig;