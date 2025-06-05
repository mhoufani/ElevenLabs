import Logger from '../logger';

describe('Logger', () => {
  const mockDate = new Date('2024-01-01T00:00:00.000Z');
  const mockConsole = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  };

  beforeAll(() => {
    // Mock Date to return a fixed timestamp
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
  });

  beforeEach(() => {
    // Replace console methods with mocks before each test
    const originalConsole = global.console;
    global.console = {
      ...originalConsole,
      log: mockConsole.log,
      warn: mockConsole.warn,
      error: mockConsole.error,
      debug: mockConsole.debug
    };
    
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original console methods after each test
    const originalConsole = global.console;
    global.console = originalConsole;
  });

  afterAll(() => {
    // Restore Date mock
    jest.restoreAllMocks();
  });

  it('should log info messages correctly', () => {
    const context = 'TestContext';
    const message = 'Test info message';

    Logger.info(context, message);

    expect(mockConsole.log).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] INFO [TestContext]: Test info message'
    );
  });

  it('should log warn messages correctly', () => {
    const context = 'TestContext';
    const message = 'Test warning message';
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at Test.test';

    Logger.warn(context, message, error);

    expect(mockConsole.warn).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] WARN [TestContext]: Test warning message\nError: Test error\nStack: Error: Test error\n    at Test.test'
    );
  });

  it('should log error messages correctly', () => {
    const context = 'TestContext';
    const message = 'Test error message';
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at Test.test';

    Logger.error(context, message, error);

    expect(mockConsole.error).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] ERROR [TestContext]: Test error message\nError: Test error\nStack: Error: Test error\n    at Test.test'
    );
  });

  it('should log debug messages correctly', () => {
    const context = 'TestContext';
    const message = 'Test debug message';
    const data = { key: 'value' };

    Logger.debug(context, message, data);

    expect(mockConsole.debug).toHaveBeenCalledWith(
      '[2024-01-01T00:00:00.000Z] DEBUG [TestContext]: Test debug message\nError Details: {"key":"value"}'
    );
  });
});
