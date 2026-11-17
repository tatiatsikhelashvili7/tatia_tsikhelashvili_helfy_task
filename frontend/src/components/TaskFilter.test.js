import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskFilter from './TaskFilter';

test('marks the current filter as pressed', function () {
  const { getByText } = render(<TaskFilter current="pending" onChange={function () {}} />);
  expect(getByText('Pending').getAttribute('aria-pressed')).toBe('true');
  expect(getByText('All').getAttribute('aria-pressed')).toBe('false');
});

test('calls onChange with the clicked filter', function () {
  const onChange = jest.fn();
  const { getByText } = render(<TaskFilter current="all" onChange={onChange} />);
  fireEvent.click(getByText('Completed'));
  expect(onChange).toHaveBeenCalledWith('completed');
});
