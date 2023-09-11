import { ReqLessonCommandHandler } from './req-lesson.command-handler';

import { mock } from 'jest-mock-extended';
import { CustomersRepositoryPort } from '../../database/repository/customers.repository.port';
import { CoachesRepositoryPort } from '../../database/repository/coaches.repository.port';
import { LessonRepositoryPort } from '../../database/repository/lesson.repository.port';
import { LessonEntity } from '../../database/entitity/lesson.entity';
import {
  ICustomerDao,
  ReqLessonInboundPortInputDto,
} from '../../interface/req-lesson.interface';
import { LessonNumber } from '../../interface/get-lesson-available-info.interface';

const inputData: ReqLessonInboundPortInputDto = {
  customerName: 'John Doe',
  phoneNumber: '1234567890',
  coachName: '김민준',
  isRegularLesson: true,
  timesPerWeek: 3,
  endTime: '30min',
  lessonTimes: [
    new Date('2023-09-04T10:00'),
    new Date('2023-09-06T14:00'),
    new Date('2023-09-08T13:00'),
  ],
};
export const lessonData: LessonEntity[] = [
  {
    id: 1,
    customerId: 1,
    coachId: 1,
    courtId: 1,
    startTime: new Date('2023-09-01 10:00:00'),
    endTime: '30min',
    lessonType: 'trial',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 2,
    customerId: 5,
    coachId: 1,
    courtId: 1,
    startTime: new Date('2023-09-01 10:30:00'),
    endTime: '1hour',
    lessonType: 'trial',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 3,
    customerId: 2,
    coachId: 2,
    courtId: 2,
    startTime: new Date('2023-09-02 10:00:00'),
    endTime: '1hour',
    lessonType: 'twice_a_week',
    dayOfweek: 'Saturday',
    isCancelled: false,
  },
  {
    id: 4,
    customerId: 2,
    coachId: 2,
    courtId: 2,
    startTime: new Date('2023-09-03 10:00:00'),
    endTime: '1hour',
    lessonType: 'twice_a_week',
    dayOfweek: 'Sunday',
    isCancelled: false,
  },
  {
    id: 5,
    customerId: 3,
    coachId: 1,
    courtId: 4,
    startTime: new Date('2023-09-01 11:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 6,
    customerId: 3,
    coachId: 4,
    courtId: 3,
    startTime: new Date('2023-09-04 12:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Monday',
    isCancelled: false,
  },
  {
    id: 7,
    customerId: 3,
    coachId: 3,
    courtId: 2,
    startTime: new Date('2023-09-01 12:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 8,
    customerId: 4,
    coachId: 4,
    courtId: 3,
    startTime: new Date('2023-09-01 11:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 9,
    customerId: 4,
    coachId: 4,
    courtId: 3,
    startTime: new Date('2023-09-01 12:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 10,
    customerId: 4,
    coachId: 1,
    courtId: 2,
    startTime: new Date('2023-09-01 12:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Friday',
    isCancelled: false,
  },
  {
    id: 11,
    customerId: 4,
    coachId: 1,
    courtId: 2,
    startTime: new Date('2023-09-06 12:00:00'),
    endTime: '30min',
    lessonType: 'three_times_a_week',
    dayOfweek: 'Wednesday',
    isCancelled: false,
  },
];

const mockCustomersRepositoryPort = mock<CustomersRepositoryPort>();
const mockCoachesRepositoryPort = mock<CoachesRepositoryPort>();
const mockLessonRepositoryPort = mock<LessonRepositoryPort>();

let handler: ReqLessonCommandHandler;

beforeEach(async () => {
  handler = new ReqLessonCommandHandler(
    mockCustomersRepositoryPort,
    mockCoachesRepositoryPort,
    mockLessonRepositoryPort,
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('레슨 신청', () => {
  it('inputData를 넣으면 난수의 id와 pw가 출력되어야합니다.', async () => {
    mockCoachesRepositoryPort.findOneByCoachName.mockReturnValue(
      Promise.resolve({ id: 1, name: '김민준' }),
    );
    mockLessonRepositoryPort.findAll.mockReturnValue(
      Promise.resolve(lessonData),
    );
    mockCustomersRepositoryPort.insertCustomer.mockReturnValue(
      Promise.resolve(1),
    );
    const result = await handler.execute(inputData);
    expect(result).toBeDefined();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('password');
  });
  it('코치 이름이 유병국일때 코치를 찾을수가 없어야 합니다.', async () => {
    mockCoachesRepositoryPort.findOneByCoachName.mockReturnValue(
      Promise.resolve(undefined),
    );
    mockLessonRepositoryPort.findAll.mockReturnValue(
      Promise.resolve(lessonData),
    );
    const invalidRequestBody = inputData;
    invalidRequestBody.coachName = '유병국';
    try {
      await handler.execute(invalidRequestBody);
    } catch (error) {
      expect(error.message).toEqual('그 코치는 속해 있지 않습니다.');
    }
  });
  it('getLessonType 메소드에서 올바른 레슨 유형을 반환해야 한다', () => {
    let isRegular = true;
    let timesPerWeek = 2;

    let result = handler.getLessonType(isRegular, timesPerWeek);

    expect(result).toBe(LessonNumber.TWICE);
  });
  it('checkCollisionForRegularLessons 메소드에서 해당 코치 정규레슨이 있는 요일,시간일 경우 충돌 이셉션을 나타나야 합니다.', () => {
    const coachOne = lessonData.filter((e) => e.coachId == 1);
    const lessonTime = [new Date('2023-09-01 10:00:00')];
    try {
      handler.checkCollisionForRegularLessons(coachOne, lessonTime);
    } catch (err) {
      expect(err.message).toEqual(
        'Collision detected at Fri Sep 01 2023 10:00:00 GMT+0900 (Korean Standard Time)',
      );
    }
  });
  it('checkCollisionForOneTimeLessons 메소드에서 해당 코치 일회성레슨이 있는 시간일 경우 충돌 이셉션을 나타나야 합니다.', () => {
    const coachOne = lessonData.filter((e) => e.coachId == 1);

    const lessonTime = new Date('2023-09-01 10:00:00');
    try {
      handler.checkCollisionForOneTimeLessons(coachOne, lessonTime);
    } catch (err) {
      expect(err.message).toEqual(
        'Collision detected at Fri Sep 01 2023 10:00:00 GMT+0900 (Korean Standard Time)',
      );
    }
  });
});

describe('코트 배정', () => {
  it('주말에 일부 코트만 사용 중이고, 예를 들어 1번 코트가 사용 중이라면, 다음으로 이용 가능한 코트 번호인 2가 반환되어야 합니다', () => {
    const weekendLessons: LessonEntity[] = [
      {
        isCancelled: false,
        courtId: 1,
        lessonType: 'trial',
        dayOfweek: 'Saturday',
        startTime: new Date('2023-09-23T10:00'),
        customerId: 1,
        endTime: '30min',
        coachId: 1,
      },
    ];

    const newLessonTime = new Date('2023-09-23T10:00'); // 주말 날짜와 시간 설정
    const res = handler.assignCourt(weekendLessons, newLessonTime);
    expect(res).toBe(2);
  });
  it('주말에 모든 코트가 사용 중이라면, 에러를 던져야 합니다.', () => {
    // 4번, 5번, 6번 테스트를 위한 평일용 더미 데이터:
    const regularLessons: LessonEntity[] = [
      {
        isCancelled: false,
        courtId: 1,
        lessonType: 'three_times_a_week',
        dayOfweek: 'Sunday',
        startTime: new Date('2023-09-24T10:00'),
        customerId: 1,
        endTime: '30min',
        coachId: 1,
      },
      {
        isCancelled: false,
        courtId: 2,
        lessonType: 'three_times_a_week',
        dayOfweek: 'Sunday',
        startTime: new Date('2023-09-24T10:00'),
        customerId: 2,
        endTime: '30min',
        coachId: 3,
      },
      {
        isCancelled: false,
        courtId: 3,
        lessonType: 'three_times_a_week',
        dayOfweek: 'Sunday',
        startTime: new Date('2023-09-24T10:00'),
        customerId: 3,
        endTime: '30min',
        coachId: 4,
      },
    ];
    const newLessonTime = new Date('2023-09-24T10:00'); // 주말 날짜와 시간 설정
    try {
      handler.assignCourt(regularLessons, newLessonTime);
    } catch (err) {
      expect(err.message).toEqual('No courts are available at this time');
    }
  });
});
