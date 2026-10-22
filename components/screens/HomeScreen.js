import AggiornamentiBar from "../cards/AggiornamentiBar";
import HabitsCard from "../cards/HabitsCard";
import RemindersCard from "../cards/RemindersCard";
import GoalsCard from "../cards/GoalsCard";
import ToDoCard from "../cards/ToDoCard";

export default function HomeScreen() {
  return (
    <div className="screen-home">
      <AggiornamentiBar />
      <HabitsCard />
      <ToDoCard />
      <RemindersCard />
      <GoalsCard />
    </div>
  );
}
