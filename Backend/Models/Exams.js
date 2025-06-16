const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exam name is required"],
    },
    description: {
      type: String,
      required: [true, "Exam description is required"],
    },
    questions: [
      {
        questionText: {
          type: String,
          required: [true, "Question text is required"],
        },
        choices: {
          type: [
            {
              text: {
                type: String,
                required: true,
              },
              isCorrect: {
                type: Boolean,
                default: false,
              },
            },
          ],
          validate: [
            {
              validator: function (choices) {
                return choices.length >= 2 && choices.length <= 4;
              },
              message: "Questions must have between 2 and 4 choices",
            },
            {
              validator: function (choices) {
                return (
                  choices.filter((choice) => choice.isCorrect).length === 1
                );
              },
              message: "Question must have exactly one correct answer",
            },
          ],
          required: [true, "Question choices are required"],
        },
        marks: {
          type: Number,
          required: [true, "Question marks are required"],
          min: [1, "Question marks cannot be negative"],
        },
      },
    ],
    totalMarks: {
      type: Number,
    },
    questionCount: {
      type: Number,
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

examSchema.pre("save", function (next) {
  this.totalMarks = this.questions.reduce(
    (total, question) => total + question.marks,
    0
  );
  this.questionCount = this.questions.length;
  next();
});

examSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.questions) {
    update.totalMarks = update.questions.reduce(
      (total, question) => total + question.marks,
      0
    );
    update.questionCount = update.questions.length;
  }
  next();
});

const Exam = mongoose.model("Exam", examSchema);

module.exports = Exam;
