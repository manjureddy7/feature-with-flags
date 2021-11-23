import calculateUserEnablementThreshold from "./threshold";

/**
 * This method provides the unique threshold value based on unique userID
 * @param featureFlagName 
 * @param userID 
 * @returns 
 */
const getUserThreshold = (featureFlagName: string, userID: string) => {
    return calculateUserEnablementThreshold(featureFlagName, userID);
};

export default getUserThreshold;