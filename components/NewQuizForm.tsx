import { FormEventHandler, useState } from "react";
import { useMutation } from "react-query";
import { Quiz, Question } from "types";
import { API_URL, POST_HEADERS } from "urls";

interface Props {
  onSubmit: () => void;
}

type DraftQuiz = Omit<Quiz, "id" | "questions">;
type DraftQuestion = Omit<Question, "id" | "quiz_id">;

export default function NewQuizForm(props: Props) {
  const { onSubmit } = props;

  const [draftQuiz, setDraftQuiz] = useState<DraftQuiz>({
    name: "",
  });
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([]);

  const saveQuizMutation = useMutation("saveQuizz", async () => {
    const rawResponse = await fetch(`${API_URL}/quizzes`, {
      method: "POST",
      headers: POST_HEADERS,
      body: JSON.stringify(draftQuiz),
    });
    const createdQuiz: Quiz = await rawResponse.json();

    const promises = draftQuestions.map(async (draftQuestion) => {
      const rawResponse = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: POST_HEADERS,
        body: JSON.stringify({...draftQuestion, quiz_id: createdQuiz.id}),
      });
      const createdQuestion: Question = await rawResponse.json();
      return createdQuestion;
    });

    await Promise.all(promises)

    onSubmit();
    resetForm()
  });

  function resetForm () {
    setDraftQuiz({name: ""})
    setDraftQuestions([]);
  }

  function handleAddQuestion() {
    setDraftQuestions([...draftQuestions, { text: "" }]);
  }

  function handleQuestionChange(value: string, index: number) {
    const draftQuestionsCopy = [...draftQuestions];
    draftQuestionsCopy[index].text = value;
    setDraftQuestions(draftQuestionsCopy);
  }

  function handleRemoveQuestion(index: number) {
    const draftQuestionsCopy = [...draftQuestions];
    draftQuestionsCopy.splice(index, 1);
    setDraftQuestions(draftQuestionsCopy);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveQuizMutation.mutate();
      }}
    >
      <label htmlFor="quizzname">Quiz name</label>
      <br />
      <input
        id="quizname"
        type="text"
        value={draftQuiz.name}
        placeholder="My awesome quizz"
        onChange={(e) =>
          setDraftQuiz({
            ...draftQuiz,
            name: e.currentTarget.value,
          })
        }
      />
      <h3>Questions</h3>
      {draftQuestions.map((draftQuestion, index) => (
        <div key={index}>
          <label htmlFor={`question ${index + 1}`}>Question {index + 1}</label>
          <input
            id={`question ${index + 1}`}
            type="text"
            value={draftQuestion.text}
            onChange={(e) => handleQuestionChange(e.currentTarget.value, index)}
          />
          <button type="button" onClick={() => handleRemoveQuestion(index)}>
            Remove
          </button>
        </div>
      ))}
      <br />
      <button type="button" onClick={handleAddQuestion}>
        Add question
      </button>
      <br />
      <br />
      <button type="submit">Save Quiz</button>
    </form>
  );
}
