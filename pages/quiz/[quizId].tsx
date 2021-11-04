import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { Quiz } from "types";
import { API_URL } from "urls";

interface PageProps {
  quiz: Quiz;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const quiz = await fetch(`${API_URL}/quizzes/${context.query.quizId}`).then(
    (res) => res.json()
  );
  return { props: { quiz } };
};

export default function TakeQuizPage(props: PageProps) {
  const { quiz } = props;

  function handleSubmit() {}

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h1>{quiz.name}</h1>
      {quiz.questions.map((question) => (
        <div key={question.id}>
          <label htmlFor={`question: ${question.id}`}>{question.text}</label>
          <br />
          <input
            id={`question: ${question.id}`}
            type="text"
            placeholder="Your answer"
          />
          <br />
          <br />
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
