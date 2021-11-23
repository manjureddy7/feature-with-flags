const hasha = require('hasha');

const stringHash = (string: string) => {
  let hash = 5381;
  let length = string.length;

  while(length) {
    hash = (hash * 33) ^ string.charCodeAt(--length);
  }
  return hash >>> 0;
};

function calculateUserEnablementThreshold (featureName: string, userID: string) {
  const hash = hasha(`${featureName}-${userID}`);
  return (stringHash(hash) % 100) + 1;
}

export default calculateUserEnablementThreshold;