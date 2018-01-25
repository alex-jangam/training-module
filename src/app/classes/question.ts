export class Question {
  constructor(
    public question: string = "",
    public topic: string = "",
    public course: string = "",
    public code: string = null,
    public priority: number = 0,
    public guides : string[] = [],
    public snippets : string[] = [],
  ) {  }
}
