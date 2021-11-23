import Cronr from 'cronr';
import { ActivationStrategyFeatureParams } from "../types";

/**
 * This method will toggle a feature based on the user defined expression
 * @param featureParams 
 * @returns 
 */
const getFeatureFlagForScheduler = (featureParams: ActivationStrategyFeatureParams): boolean | any => {

    const { featureFlagDetails: { enable }, value } = featureParams;
    let isFlagEnabled = enable;

    const cb = () => {
        isFlagEnabled = !isFlagEnabled;
        console.log('im callback function', isFlagEnabled)
        // return isFlagEnabled;
    };

    const job = new Cronr(value, cb, {
        startTime: new Date(),
    });

    job.start();
    return cb;
}

export default getFeatureFlagForScheduler;