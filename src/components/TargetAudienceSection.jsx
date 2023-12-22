const TargetAudienceSection = () => {
  const targetAudienceData = [
    {
      title: "Students",
      description:
        "Efficiently manage your assignments, deadlines, and personal tasks in one centralized platform.",
      benefits: [
        "Stay organized with a personalized to-do list",
        "Never miss a deadline with task reminders",
        "Improve productivity and time management",
      ],
    },
    {
      title: "Professionals",
      description:
        "Enhance your work efficiency by keeping track of your professional tasks and projects.",
      benefits: [
        "Manage work projects and deadlines effectively",
        "Prioritize tasks for optimal productivity",
        "Collaborate with teams by sharing task lists",
      ],
    },
    {
      title: "Freelancers",
      description:
        "Organize your freelance projects, set milestones, and ensure timely delivery of tasks.",
      benefits: [
        "Keep track of multiple projects with ease",
        "Set and meet project milestones",
        "Improve communication with clients through shared task lists",
      ],
    },
    // Add more audience types as needed
  ];

  return (
    <section className="py-16 mb-44 text-[#F87060]">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-8 text-center">
          Who Can Benefit?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-zinc-800">
          {targetAudienceData.map((audience, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">{audience.title}</h3>
              <p className="text-gray-600 mb-4">{audience.description}</p>
              <ul className="list-disc ml-6">
                {audience.benefits.map((benefit, idx) => (
                  <li key={idx} className="text-gray-700">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetAudienceSection;
