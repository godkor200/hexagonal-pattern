import { GetLessonAvailableInfoQueryHandler } from './get-lesson-available-info.query-handler';
import { CoachesRepositoryPort } from '../../database/repository/coaches.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';
import { mock } from 'jest-mock-extended';
import { lessonData } from '../../command/req-lesson/req-lesson.command-handler.spec';
import {
  LessonNumber,
  LessonTime,
  LessonType,
} from '../../interface/get-lesson-available-info.interface';
import { list } from './dummy';

let handler: GetLessonAvailableInfoQueryHandler;

const mockCoachesRepositoryPort = mock<CoachesRepositoryPort>();
const mockLessonRepositoryPort = mock<LessonRepositoryPort>();
beforeEach(async () => {
  handler = new GetLessonAvailableInfoQueryHandler(
    mockCoachesRepositoryPort,
    mockLessonRepositoryPort,
  );
});

describe('레슨 가능 시간', () => {
  it('김민준 코치의 1회레슨의 60분 가능 시간의 리스트를 뽑아냅니다.', async () => {
    mockCoachesRepositoryPort.findOneByCoachName.mockReturnValue(
      Promise.resolve({ id: 1, name: '김민준' }),
    );
    const kimCoachLessons = lessonData.filter((e) => e.coachId == 1);
    mockLessonRepositoryPort.findAllByCoachId.mockReturnValue(
      Promise.resolve(kimCoachLessons),
    );
    expect(
      await handler.execute({
        coachName: '김민준',
        lessonType: LessonType.SINGLE,
        lessonTime: LessonTime.ONE_HOUR,
        lessonNumber: LessonNumber.TWICE,
      }),
    ).toEqual(list);
  });

   it("isTimeSlotOccupied 메소드로 김민준 코치의 30분 '2023-09-06 12:00:00 레슨을 받을수 있을까 테스트",()=>{
       const kimCoachLessons = lessonData.filter((e) => e.coachId == 1);

       expect(handler.isTimeSlotOccupied("2023-09-06 12:00:00",kimCoachLessons)).toBe(true)
   })
});
