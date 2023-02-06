module.exports = (quiz, answers) => {
  let marksObtained = 0;

  const validAnswers = quiz.questions.map((question) => {
    const answer = answers.find((ans) => ans.questionId === question.id);

    if (answer.optionId !== "")
      // for unattempted questions
      marksObtained +=
        question.correctOptionId === answer.optionId
          ? question.weightage
          : -question.negativeMark;

    return answer;
  });

  return {
    report: {
      marksObtained,
      fullMarks: quiz.fullMarks,
      percentage: (marksObtained * 100) / quiz.fullMarks,
    },
    validAnswers,
  };
};
