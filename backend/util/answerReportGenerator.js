module.exports = (quiz, answers) => {
  let marksObtained = 0;

  const validAnswers = quiz.questions.map((question) => {
    const answer = answers.find((ans) => ans.questionId === question.id);

    marksObtained +=
      question.correctOptionId === answer.optionId ? question.weightage : 0;

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
