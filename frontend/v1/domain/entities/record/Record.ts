import { isEqual, cloneDeep } from "lodash";
import { Field } from "../field/Field";
import { Question } from "../question/Question";
import { Suggestion } from "../question/Suggestion";
import { RecordAnswer } from "./RecordAnswer";

const DEFAULT_STATUS = "pending";

export class Record {
  // eslint-disable-next-line no-use-before-define
  private original: Record;
  public updatedAt?: string;

  constructor(
    public readonly id: string,
    public readonly datasetId: string,
    public readonly questions: Question[],
    public readonly fields: Field[],
    public answer: RecordAnswer,
    private readonly suggestions: Suggestion[],
    public readonly page: number
  ) {
    this.completeQuestion();
    this.updatedAt = answer?.updatedAt;
  }

  get status() {
    return this.answer?.status ?? DEFAULT_STATUS;
  }

  get isPending() {
    return this.status === DEFAULT_STATUS;
  }

  get isSubmitted() {
    return this.status === "submitted";
  }

  get isDiscarded() {
    return this.status === "discarded";
  }

  get isDraft() {
    return this.status === "draft";
  }

  get isModified() {
    const { original, ...rest } = this;

    return !!original && !isEqual(original, rest);
  }

  discard(answer: RecordAnswer) {
    this.answer = answer;
    this.updatedAt = answer.updatedAt;

    this.initialize();
  }

  submit(answer: RecordAnswer) {
    this.answer = answer;
    this.updatedAt = answer.updatedAt;

    this.initialize();
  }

  clear() {
    this.questions.forEach((question) => question.clearAnswer());

    this.answer = null;

    this.initialize();
  }

  initialize() {
    this.completeQuestion();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { original, ...rest } = this;

    this.original = cloneDeep(rest);
  }

  get hasAnyQuestionAnswered() {
    return this.questions.some(
      (question) => question.answer.isValid || question.answer.isPartiallyValid
    );
  }

  questionAreCompletedCorrectly() {
    const requiredQuestionsAreCompletedCorrectly = this.questions
      .filter((input) => input.isRequired)
      .every((input) => {
        return input.isAnswered;
      });

    const optionalQuestionsCompletedAreCorrectlyEntered = this.questions
      .filter((input) => !input.isRequired)
      .every((input) => {
        return input.hasValidValues;
      });

    return (
      requiredQuestionsAreCompletedCorrectly &&
      optionalQuestionsCompletedAreCorrectlyEntered
    );
  }

  private completeQuestion() {
    return this.questions.map((question) => {
      const answerForQuestion = this.answer?.value[question.name];

      if (this.isPending || this.isDraft) {
        question.complete(answerForQuestion);

        const suggestion = this.suggestions?.find(
          (s) => s.questionId === question.id
        );

        question.suggests(suggestion);
      } else {
        question.forceComplete(answerForQuestion);
      }

      return question;
    });
  }
}
