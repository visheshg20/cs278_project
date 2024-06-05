export const groupActivities = [
  "Casual soccer match",
  "Super Smash Bros & Mario Kart Tournament",
  "Board Game Nights",
  "Group Hikes",
  "Rock Climbing",
  "Cooking Classes",
  "Wine & Cheese Night",
  "Volunteering",
];

const rankQuestions = groupActivities.map((activity) => {
  return {
    field: "groupActivitiesRankings",
    subfield: activity,
    type: "numeric",
    table: "Survey",
    question: `Rank this activity in order of preference: ${activity}`,
    validation: (input: string[]) => {
      return "";
    },
    range: [1, groupActivities.length],
  };
});

export const questions: {
  field: string;
  type: string;
  question: string;
  table: string;
  validation: (input: string) => string;
  options?: string[];
  subfield?: string;
  range?: number[];
}[] = [
  {
    field: "firstName",
    type: "text",
    table: "Users",
    question: "What's your first name?",
    validation: (input: string) => {
      return input.trim().length > 0 ? "" : "Please enter your name";
    },
  },
  {
    field: "lastName",
    type: "text",
    table: "Users",
    question: "What's your last name?",
    validation: (input: string) => {
      return input.trim().length > 0 ? "" : "Please enter your name";
    },
  },
  {
    field: "prefName",
    type: "text",
    table: "Users",
    question: "What's your preferred name or nickname?",
    validation: (input: string) => {
      return "";
    },
  },
  {
    field: "studentStatus",
    type: "radio",
    table: "Users",
    question: "What's your school status?",
    validation: (input: string) => {
      return ["Undergraduate Student", "Graduate Student"].includes(input)
        ? ""
        : "Please select an option";
    },
    options: ["Undergraduate Student", "Graduate Student"],
  },
  {
    field: "school",
    type: "text",
    table: "Users",
    question: "What school do you attend?",
    validation: (input: string) => {
      return input.toLowerCase().includes("stanford")
        ? ""
        : "Nice try, we know you go to Stanford smh";
    },
  },
  {
    field: "phoneNumber",
    type: "text",
    table: "Users",
    question:
      "What's your number? (we'll use this to notify you about updates but won't spam you 😉 )",
    validation: (input: string) => {
      return input.trim().match(/^\d{10}$/)
        ? ""
        : "Please enter a valid phone number";
    },
  },
  {
    field: "values",
    type: "checkbox",
    table: "Survey",
    question:
      "Which values are most important to you in a friendship? (Select up to three)",
    validation: (input: string[]) => {
      return input.length < 4 ? "" : "Please select up to three values";
    },
    options: [
      "Dark Humor",
      "Sarcasm",
      "Empathy",
      "Loyalty",
      "Honesty",
      "Open-mindedness",
      "Reliability",
      "Adventurousness",
      "Supportiveness",
      "Intellectual Curiosity",
      "Creativity",
      "Optimism",
      "Social Conscience",
    ],
  },
  {
    field: "activities",
    type: "checkbox",
    table: "Survey",
    question:
      "How do you prefer to spend your free time? (Select all that apply)",
    validation: (input: string[]) => {
      return "";
    },
    options: [
      "Outdoors",
      "Gaming",
      "Reading/Writing",
      "Sports & Working Out",
      "Arts & Crafts",
      "Watching TV & Movies",
      "Going out & Nightlife",
    ],
  },
  {
    field: "excitementLevel",
    type: "numeric",
    table: "Survey",
    question:
      "How excited are you to meet IRL? (1=not excited, 5=very excited)",
    validation: (input: string[]) => {
      return "";
    },
    range: [1, 5],
  },
  {
    field: "bio",
    type: "textarea",
    table: "Users",
    question:
      "Give us a little bio about yourself to share with others! (~50 words)",
    validation: (input: string) => {
      return input.length < 25 ? "Tell us just a biiiit more :D" : "";
    },
  },
  {
    field: "",
    type: "info",
    table: "",
    question: `This next section will ask you to rank the following activities: ${groupActivities.join(
      ", "
    )}`,
    validation: (input: string) => {
      return "";
    },
  },

  ...rankQuestions,
];
