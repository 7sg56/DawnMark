
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../../hooks/useIsMobile';

describe('useIsMobile', () => {
  let innerWidthSpy: jest.Mock;
  const originalInnerWidth = window.innerWidth;

  beforeEach(() => {
    // Reset spy
    innerWidthSpy = jest.fn(() => 1000); // Desktop by default

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      get: innerWidthSpy,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    // Restore original window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: originalInnerWidth,
    });
    jest.useRealTimers();
  });

  it('correctly updates isMobile when window is resized', () => {
    const { result } = renderHook(() => useIsMobile(768));

    // Initially desktop (1000px)
    expect(result.current.isMobile).toBe(false);

    // Resize to mobile
    act(() => {
      innerWidthSpy.mockReturnValue(500);
      window.dispatchEvent(new Event('resize'));
      // Advance timer for potential debounce
      jest.advanceTimersByTime(250);
    });

    expect(result.current.isMobile).toBe(true);

    // Resize back to desktop
    act(() => {
      innerWidthSpy.mockReturnValue(1000);
      window.dispatchEvent(new Event('resize'));
      // Advance timer for potential debounce
      jest.advanceTimersByTime(250);
    });

    expect(result.current.isMobile).toBe(false);
  });

  it('counts how many times innerWidth is accessed during rapid resize events (Performance Check)', () => {
    const { result } = renderHook(() => useIsMobile());

    // Clear mock calls to focus on resize events
    innerWidthSpy.mockClear();

    console.log('Simulating 100 resize events...');

    // Simulate 100 rapid resize events
    act(() => {
      for (let i = 0; i < 100; i++) {
        window.dispatchEvent(new Event('resize'));
      }
      // If debounce is implemented, we might need to advance timers
      jest.advanceTimersByTime(1000);
    });

    const resizeCalls = innerWidthSpy.mock.calls.length;

    console.log(`Resize triggered innerWidth accesses: ${resizeCalls}`);

    // In unoptimized version, this should be >= 100
    // In optimized version (debounce), this should be small (e.g. 1)
  });
});
