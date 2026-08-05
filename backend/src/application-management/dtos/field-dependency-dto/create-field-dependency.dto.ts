import { IsString } from 'class-validator';

export class CreateFieldDependencyDto {
  @IsString()
  questionId: string; // The main question ID

  @IsString()
  dependentQuestionId: string; // The dependent question ID

  @IsString()
  choiceId: string; // The choice ID that triggers the dependency
}
