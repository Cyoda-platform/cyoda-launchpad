import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CloudWaitlistForm from '@/components/CloudWaitlistForm';

// trackCtaConversion is fired on successful submits — keep it inert in tests.
vi.mock('@/utils/analytics', () => ({
  trackCtaConversion: vi.fn(),
}));

const renderForm = () =>
  render(
    <MemoryRouter>
      <CloudWaitlistForm />
    </MemoryRouter>,
  );

const fillEmail = (value: string) =>
  fireEvent.change(screen.getByLabelText(/work email/i), { target: { value } });

const submit = () => fireEvent.click(screen.getByRole('button', { name: /join the waitlist/i }));

describe('CloudWaitlistForm', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers({ now: 0, shouldAdvanceTime: true });
    fetchMock = vi.fn().mockResolvedValue({});
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('rejects an invalid email without sending', () => {
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('not-an-email');
    submit();
    expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits to the Google Form endpoint and shows success', async () => {
    renderForm();
    vi.setSystemTime(10_000); // past the min-time window
    fillEmail('founder@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/formResponse');
    expect(init.mode).toBe('no-cors');
    expect(init.body).toContain('entry.985266879=founder%40example.com');
  });

  it('honeypot filled: shows success WITHOUT sending', async () => {
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('bot@example.com');
    // The honeypot is hidden from humans but present in the DOM.
    fireEvent.change(screen.getByTestId('hp-field'), { target: { value: 'http://spam' } });
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submission faster than the min-time window: success WITHOUT sending', async () => {
    renderForm();
    vi.setSystemTime(1_000); // only 1s after mount (< 3s)
    fillEmail('fast@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/you're on the list/i)).toBeInTheDocument());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('network failure shows the error state', async () => {
    fetchMock.mockRejectedValueOnce(new Error('offline'));
    renderForm();
    vi.setSystemTime(10_000);
    fillEmail('founder@example.com');
    submit();
    await waitFor(() => expect(screen.getByText(/something went wrong/i)).toBeInTheDocument());
  });
});
