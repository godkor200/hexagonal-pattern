module.exports = {
    preset: 'ts-jest', //  ts-jest를 사용한다고 알려준다
    testEnvironment: 'node', //테스트 환경 'node' 환경을 사용한다 알려줌
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    modulePaths: ['<rootDir>'],
    rootDir: './',
    verbose: true,
    moduleNameMapper: {
        'Api/(.*)$': '<rootDir>/apps/product-page-api/$1',
        'Libs/(.*)$': '<rootDir>/libs/$1',
    },
};