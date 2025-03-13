import { HoverEffect } from "../ui/card-hover-effect";
export const events = [
    {
      title: "Running Marathon",
      description: "Join our annual running marathon in the city park.",
      owner: "John Doe",
      time: "2025-03-20 10:00 AM",
      place: "City Park",
      participants: 120,
      status: "Upcoming",
      comments: ["Excited!", "Can't wait!", "Hope the weather is nice."],
      link: "/events/marathon",
    },
    {
      title: "Yoga Session",
      description: "Relax and meditate with our guided yoga session.",
      owner: "Jane Smith",
      time: "2025-03-18 6:30 PM",
      place: "Wellness Center",
      participants: 50,
      status: "Ongoing",
      comments: ["Great session!", "Very relaxing."],
      link: "/events/yoga",
    },
    {
      title: "Gym Training",
      description: "Boost your strength with our advanced gym training program.",
      owner: "Mike Johnson",
      time: "2025-03-25 5:00 PM",
      place: "Downtown Gym",
      participants: 80,
      status: "Upcoming",
      comments: ["Looking forward!", "Who else is coming?"],
      link: "/events/gym",
    },
  ];
  
  
  export function CardForm() {
    return (
      <div className="max-w-5xl mx-auto px-8">
        <HoverEffect items={events} />
      </div>
    );
  }
  
  export default CardForm;