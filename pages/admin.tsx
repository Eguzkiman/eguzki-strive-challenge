import NewQuizForm from "components/NewQuizForm";
import { useQuery } from "react-query";
import { Quiz } from "types";
import { API_URL } from "urls";

export default function AdminPage() {
  const { isLoading, error, data, refetch } = useQuery<Quiz[]>("quizzes", () =>
    fetch(`${API_URL}/quizzes`).then((res) => res.json())
  );

  if (isLoading) {
    return <p>Loading quiz data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!data) {
    return <p>Incomplete data</p>;
  }

  return (
    <div>
      <h2>New Quizz</h2>
      <NewQuizForm onSubmit={refetch} />
      <h2>All Quizzes</h2>
      <ul>
        {data.map((quiz) => (
          <li key={quiz.id}>{quiz.name} | {quiz.questions.length} questions | {quiz.submissions.length} submissions</li>
        ))}
      </ul>
    </div>
  );
}
