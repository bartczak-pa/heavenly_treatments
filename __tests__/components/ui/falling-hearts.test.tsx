import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { FallingHearts } from '@/components/ui/falling-hearts';

// Path2D and ResizeObserver are not available in jsdom
class Path2DMock {
  constructor(_d?: string) {}
}
vi.stubGlobal('Path2D', Path2DMock);

const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
vi.stubGlobal('ResizeObserver', mockResizeObserver);

// Mock canvas context — jsdom doesn't implement canvas
const mockCtx = {
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  scale: vi.fn(),
  fill: vi.fn(),
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  set globalAlpha(_v: number) {},
  set fillStyle(_v: string) {},
};

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(mockCtx);
});

describe('FallingHearts', () => {
  let cancelAnimationFrameSpy: ReturnType<typeof vi.spyOn>;
  let matchMediaSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');
    matchMediaSpy = vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: false,
    } as MediaQueryList);
  });

  afterEach(() => {
    cancelAnimationFrameSpy.mockRestore();
    matchMediaSpy.mockRestore();
  });

  it('renders a canvas element with correct attributes', () => {
    const { container } = render(<FallingHearts />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
    expect(canvas).toHaveAttribute('role', 'presentation');
  });

  it('applies pointer-events-none class', () => {
    const { container } = render(<FallingHearts />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveClass('pointer-events-none');
  });

  it('passes through custom className', () => {
    const { container } = render(<FallingHearts className="fixed inset-0 z-40" />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveClass('pointer-events-none');
    expect(canvas).toHaveClass('fixed');
    expect(canvas).toHaveClass('inset-0');
    expect(canvas).toHaveClass('z-40');
  });

  it('cleans up animation frame on unmount', () => {
    const { unmount } = render(<FallingHearts />);
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });

  it('skips animation when prefers-reduced-motion is enabled', () => {
    matchMediaSpy.mockReturnValue({
      matches: true,
    } as MediaQueryList);

    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(<FallingHearts />);

    expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();

    requestAnimationFrameSpy.mockRestore();
  });

  it('does not call cancelAnimationFrame on unmount when animation was skipped', () => {
    matchMediaSpy.mockReturnValue({
      matches: true,
    } as MediaQueryList);

    const { unmount } = render(<FallingHearts />);
    unmount();

    expect(cancelAnimationFrameSpy).not.toHaveBeenCalled();
  });

  it('starts animation when reduced motion is not preferred', () => {
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');

    render(<FallingHearts />);

    expect(requestAnimationFrameSpy).toHaveBeenCalled();

    requestAnimationFrameSpy.mockRestore();
  });
});
