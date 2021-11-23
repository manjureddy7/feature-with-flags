import { FeatureFlagReturnType } from "../types";


const updateStatusAndMessage = (result: FeatureFlagReturnType, featureFlag: { isFlagActive: boolean, message: string | null }) => {
    const { status, message } = result;
    featureFlag.isFlagActive = status;
    featureFlag.message = message;
}

export default updateStatusAndMessage;