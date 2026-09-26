export interface OERResource {
  id: string;

  title: string;

  description: string;

  subject: string;

  source:
    | "OpenStax"
    | "MIT OpenCourseWare"
    | "LibreTexts"
    | "Other OER";

  type:
    | "textbook"
    | "course"
    | "lecture-notes"
    | "video"
    | "assignment"
    | "exam"
    | "reference";

  url: string;

  author?: string;

  institution?: string;

  license?: string;

  topics: string[];
}

export const oerCatalog:
OERResource[] = [
  {
    id: "openstax-calculus",

    title:
      "Calculus",

    description:
      "Free OpenStax calculus learning resources covering functions, limits, derivatives, integration and related university mathematics topics.",

    subject:
      "Mathematics",

    source:
      "OpenStax",

    type:
      "textbook",

    url:
      "https://openstax.org/subjects/math",

    institution:
      "OpenStax",

    license:
      "Open educational resource",

    topics: [
      "calculus",
      "mathematics",
      "limits",
      "derivatives",
      "integration",
    ],
  },

  {
    id: "openstax-physics",

    title:
      "University Physics",

    description:
      "Free university-level physics resources available through OpenStax.",

    subject:
      "Physics",

    source:
      "OpenStax",

    type:
      "textbook",

    url:
      "https://openstax.org/subjects/science",

    institution:
      "OpenStax",

    license:
      "Open educational resource",

    topics: [
      "physics",
      "mechanics",
      "waves",
      "electricity",
      "thermodynamics",
    ],
  },

  {
    id: "openstax-computer-science",

    title:
      "Computer Science Resources",

    description:
      "OpenStax resources relevant to computing, technology, mathematics and related university subjects.",

    subject:
      "Computer Science",

    source:
      "OpenStax",

    type:
      "reference",

    url:
      "https://openstax.org/subjects",

    institution:
      "OpenStax",

    license:
      "Open educational resource",

    topics: [
      "computer science",
      "technology",
      "programming",
      "computing",
    ],
  },

  {
    id: "mit-mathematics",

    title:
      "MIT Mathematics Courses",

    description:
      "Open university course materials in mathematics from MIT OpenCourseWare.",

    subject:
      "Mathematics",

    source:
      "MIT OpenCourseWare",

    type:
      "course",

    url:
      "https://ocw.mit.edu/search/?d=Mathematics",

    institution:
      "Massachusetts Institute of Technology",

    license:
      "CC BY-NC-SA 4.0",

    topics: [
      "mathematics",
      "calculus",
      "linear algebra",
      "probability",
      "statistics",
    ],
  },

  {
    id: "mit-computer-science",

    title:
      "MIT Computer Science Courses",

    description:
      "Open computer science and engineering course materials from MIT OpenCourseWare.",

    subject:
      "Computer Science",

    source:
      "MIT OpenCourseWare",

    type:
      "course",

    url:
      "https://ocw.mit.edu/search/?d=Electrical%20Engineering%20and%20Computer%20Science",

    institution:
      "Massachusetts Institute of Technology",

    license:
      "CC BY-NC-SA 4.0",

    topics: [
      "computer science",
      "programming",
      "algorithms",
      "data structures",
      "software engineering",
      "artificial intelligence",
    ],
  },

  {
    id: "mit-engineering",

    title:
      "MIT Engineering Courses",

    description:
      "Free engineering course materials, lecture notes, assignments and learning resources.",

    subject:
      "Engineering",

    source:
      "MIT OpenCourseWare",

    type:
      "course",

    url:
      "https://ocw.mit.edu/search/?t=Engineering",

    institution:
      "Massachusetts Institute of Technology",

    license:
      "CC BY-NC-SA 4.0",

    topics: [
      "engineering",
      "mechanical engineering",
      "electrical engineering",
      "civil engineering",
    ],
  },

  {
    id: "libretexts-mathematics",

    title:
      "LibreTexts Mathematics",

    description:
      "Free open mathematics textbooks and educational resources.",

    subject:
      "Mathematics",

    source:
      "LibreTexts",

    type:
      "textbook",

    url:
      "https://math.libretexts.org/",

    institution:
      "LibreTexts",

    license:
      "Open educational resources",

    topics: [
      "mathematics",
      "algebra",
      "calculus",
      "statistics",
      "geometry",
    ],
  },

  {
    id: "libretexts-chemistry",

    title:
      "LibreTexts Chemistry",

    description:
      "Free chemistry textbooks, reference materials and learning resources.",

    subject:
      "Chemistry",

    source:
      "LibreTexts",

    type:
      "textbook",

    url:
      "https://chem.libretexts.org/",

    institution:
      "LibreTexts",

    license:
      "Open educational resources",

    topics: [
      "chemistry",
      "organic chemistry",
      "inorganic chemistry",
      "physical chemistry",
    ],
  },

  {
    id: "libretexts-biology",

    title:
      "LibreTexts Biology",

    description:
      "Open biology textbooks and university learning materials.",

    subject:
      "Biology",

    source:
      "LibreTexts",

    type:
      "textbook",

    url:
      "https://bio.libretexts.org/",

    institution:
      "LibreTexts",

    license:
      "Open educational resources",

    topics: [
      "biology",
      "genetics",
      "cell biology",
      "ecology",
      "microbiology",
    ],
  },
];
