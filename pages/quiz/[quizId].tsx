import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useMutation } from "react-query";
import { Answer, Quiz, Submission } from "types";
import { API_URL, POST_HEADERS } from "urls";

interface PageProps {
  quiz: Quiz;
}

type DraftSubmission = Omit<Submission, "id" | "answers">;
type DraftAnswer = Omit<Answer, "id" | "submission_id" | "question_id">;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const quiz = await fetch(`${API_URL}/quizzes/${context.query.quizId}`).then(
    (res) => res.json()
  );
  return { props: { quiz } };
};

export default function TakeQuizPage(props: PageProps) {
  const { quiz } = props;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [draftSubmission, setDraftSubmission] = useState<DraftSubmission>({
    name: "",
  });
  const [draftAnswers, setDraftAnswers] = useState<DraftAnswer[]>(
    quiz.questions.map((question) => ({ text: "" }))
  );

  const submitMutation = useMutation("submit", async () => {
    const rawResponse = await fetch(`${API_URL}/submissions`, {
      method: "POST",
      headers: POST_HEADERS,
      body: JSON.stringify({...draftSubmission, quiz_id: quiz.id}),
    });
    const createdSubmission: Submission = await rawResponse.json();

    const promises = quiz.questions.map(async (question, index) => {
      const rawResponse = await fetch(`${API_URL}/answers`, {
        method: "POST",
        headers: POST_HEADERS,
        body: JSON.stringify({
          ...draftAnswers[index],
          question_id: question.id,
          submission_id: createdSubmission.id,
        }),
      });
      const createdAnswer: Answer = await rawResponse.json();
      return createdAnswer;
    });

    await Promise.all(promises);
    setHasSubmitted(true)
  });

  function handleSubmit() {
    submitMutation.mutate()
  }

  function handleAnswerChange(value: string, index: number) {
    const draftAnswersCopy = [...draftAnswers];
    draftAnswersCopy[index].text = value;
    setDraftAnswers(draftAnswersCopy);
  }

  function resetForm () {
    setDraftSubmission({name: ''});
    setDraftAnswers([]);
  }

  if (hasSubmitted) {
    return <h3>Form submitted, thank you!</h3>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h1>{quiz.name}</h1>
      <label htmlFor="name">What&apos;s your name?</label>
      <br/>
      <input
        id="name"
        type="text"
        placeholder="Your name"
        value={draftSubmission.name}
        onChange={(e) =>
          setDraftSubmission({
            ...draftSubmission,
            name: e.target.value,
          })
        }
      />
      <br />
      <br />
      {quiz.questions.map((question, index) => (
        <div key={question.id}>
          <label htmlFor={`question: ${question.id}`}>{question.text}</label>
          <br />
          <input
            id={`question: ${question.id}`}
            type="text"
            placeholder="Your answer"
            value={draftAnswers[index].text}
            onChange={(e) => handleAnswerChange(e.currentTarget.value, index)}
          />
          <br />
          <br />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
