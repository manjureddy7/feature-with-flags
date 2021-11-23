import { EnableProp } from "../types";

/**
 * This method will return the ENABLE prop value as BOOLEAN instead of an array
 * @param config 
 * @returns 
 */
const transformEnableProp = (config: string[]): boolean | string[] => {
    let enable = false;
    if(config.length <= 1 && (config[0] === EnableProp.TRUTHY || config[0] === EnableProp.FALSY)) {
        enable = config[0] === EnableProp.TRUTHY;
        return enable;
    }
    return config;
};

export default transformEnableProp;