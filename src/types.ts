export type GradeLevel =
  | 'Lớp 1'
  | 'Lớp 2'
  | 'Lớp 3'
  | 'Lớp 4'
  | 'Lớp 5'
  | 'Lớp 6'
  | 'Lớp 7'
  | 'Lớp 8'
  | 'Lớp 9';

export type Semester = 'Học kì I' | 'Học kì II' | 'Cả năm';

export interface UserProfile {
  fullName: string;
  email: string;
  username: string;
  school: string;
  grade: GradeLevel;
  gender: string;
  dob: string;
}

export interface MindmapBranch {
  node: string;
  children: string[];
}

export interface AcademicSource {
  title: string;
  link: string;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface AuditCheck {
  status: 'warning' | 'error' | 'verified';
  issue: string;
  suggestion: string;
}

export interface IllustrationImage {
  caption: string;
  source: string;
  url?: string;
  svgIcon?: string;
}

export interface StructuredSection {
  type: 'concept' | 'formula' | 'rule' | 'note' | 'example';
  heading: string;
  content: string;
}

export interface AnalysisResult {
  id?: string;
  title: string;
  grade?: string;
  subject?: string;
  semester?: string;
  createdAt?: string;
  summary: string;
  structuredSections?: StructuredSection[];
  mindmap: MindmapBranch[];
  auditChecks?: AuditCheck[];
  illustrationImages?: IllustrationImage[];
  academicSources: AcademicSource[];
  flashcards: Flashcard[];
}

export interface QuizQuestion {
  id: string;
  grade: GradeLevel;
  semester?: Semester;
  subject: string;
  type: 'mc' | 'essay';
  question: string;
  options?: string[];
  answer: number | string;
  explanation: string;
}

export interface SavedNoteRecord {
  id: string;
  title: string;
  subject: string;
  grade: string;
  createdAt: string;
  summary: string;
  fullData: AnalysisResult;
}

export type RewardCategory = 'all' | 'school' | 'toys' | 'living';

export interface RewardItem {
  id: string;
  name: string;
  category: 'school' | 'toys' | 'living';
  cost: number;
  description: string;
  iconName: string;
  tag?: string;
}

export interface CreditTransaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  description: string;
  timestamp: string;
  category: 'initial' | 'scan' | 'arena' | 'reward';
}

export interface RedeemedGift {
  id: string;
  rewardId: string;
  rewardName: string;
  categoryName: string;
  cost: number;
  code: string;
  redeemedAt: string;
}
