module.exports = (optionsArray, correctOptionId, noOfOptionsDisplayed) => {
  for (let i = 0; i < optionsArray.length - noOfOptionsDisplayed + 1; i++) {
    let subset = optionsArray.slice(i, i + noOfOptionsDisplayed);

    if (subset.find((option) => option.id === correctOptionId)) return subset;
  }
  return null;
};
