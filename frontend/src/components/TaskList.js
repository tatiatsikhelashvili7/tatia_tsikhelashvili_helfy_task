import React, { useEffect, useMemo, useRef, useState } from 'react';
import TaskItem from './TaskItem';

function slideKey(task, i, n) {
  // clones get their own keys so the real slides dont remount

  if (n <= 1) {
    return 'only-' + task.id;
  }
  if (i === 0) {
    return 'clone-tail-' + task.id;
  }
  if (i === n + 1) {
    return 'clone-head-' + task.id;
  }
  return 'slide-' + task.id;
}

function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  const [current, setCurrent] = useState(1);
  const [animate, setAnimate] = useState(true);
  const wrapping = useRef(false);
  const lastId = useRef(null);
  const tasksRef = useRef(tasks);
  tasksRef.current = tasks;

  const n = tasks.length;

  // only depends on ids so toggling complete doesnt reset the slide
  const idsKey = useMemo(function () {
    const parts = [];
    for (let i = 0; i < tasks.length; i++) {
      parts.push(tasks[i].id);
    }
    return parts.join(',');
  }, [tasks]);

  useEffect(
    function () {
      const list = tasksRef.current;
      const count = list.length;
      if (count === 0) {
        setCurrent(0);
        return;
      }

      let idx = -1;
      if (lastId.current !== null) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === lastId.current) {
            idx = i;
            break;
          }
        }
      }

      setAnimate(false);
      if (count === 1) {
        setCurrent(0);
      } else if (idx >= 0) {
        setCurrent(idx + 1);
      } else {
        setCurrent(1);
      }

      const t = setTimeout(function () {
        setAnimate(true);
      }, 30);
      return function () {
        clearTimeout(t);
      };
    },
    [idsKey]
  );

  function next() {
    if (n < 2 || wrapping.current) {
      return;
    }
    setAnimate(true);
    setCurrent(function (i) {
      return i + 1;
    });
  }

  function prev() {
    if (n < 2 || wrapping.current) {
      return;
    }
    setAnimate(true);
    setCurrent(function (i) {
      return i - 1;
    });
  }

  function onEnd(e) {
    // buttons inside the card also fire transitionend
    if (e.target !== e.currentTarget) {
      return;
    }
    if (n < 2) {
      return;
    }

    // we slid onto the cloned first item, jump to the real first one
    if (current === n + 1) {
      wrapping.current = true;
      setAnimate(false);
      setCurrent(1);
      setTimeout(function () {
        wrapping.current = false;
        setAnimate(true);
      }, 40);
      return;
    }

    // same thing going backwards
    if (current === 0) {
      wrapping.current = true;
      setAnimate(false);
      setCurrent(n);
      setTimeout(function () {
        wrapping.current = false;
        setAnimate(true);
      }, 40);
    }
  }

  if (n === 0) {
    return (
      <div className="empty">
        <p>No tasks to show.</p>
        <p className="gray">Add a task or change the filter / search.</p>
      </div>
    );
  }

  // last + real tasks + first, thats what makes the loop look endless
  let slides = tasks;
  if (n > 1) {
    slides = [tasks[n - 1]].concat(tasks).concat([tasks[0]]);
  }

  let pos = current;
  if (n <= 1) {
    pos = 0;
  }

  let real = 0;
  if (n > 1) {
    real = (pos - 1 + n) % n;
  }

  if (tasks[real]) {
    lastId.current = tasks[real].id;
  }

  let trans = 'none';
  if (animate && n > 1) {
    trans = 'transform 0.5s ease-in-out';
  }

  const style = {
    transform: 'translateX(-' + pos * 100 + '%)',
    transition: trans
  };

  return (
    <div className="carousel" aria-roledescription="carousel">
      <div className="carousel-row">
        <button
          type="button"
          className="arrow"
          onClick={prev}
          disabled={n < 2}
          aria-label="Previous task"
        >
          {'‹'}
        </button>

        <div className="viewport">
          <div className="track" style={style} onTransitionEnd={onEnd}>
            {slides.map(function (task, i) {
              return (
                <div className="slide" key={slideKey(task, i, n)}>
                  <TaskItem
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggle={onToggle}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="arrow"
          onClick={next}
          disabled={n < 2}
          aria-label="Next task"
        >
          {'›'}
        </button>
      </div>

      <div className="dots" role="tablist" aria-label="Task slides">
        {tasks.map(function (task, i) {
          return (
            <button
              key={task.id}
              type="button"
              className={i === real ? 'dot on' : 'dot'}
              aria-label={'Go to task ' + (i + 1) + ': ' + task.title}
              aria-current={i === real ? 'true' : undefined}
              onClick={function () {
                if (n === 1) {
                  return;
                }
                setAnimate(true);
                setCurrent(i + 1);
              }}
            />
          );
        })}
      </div>

      <p className="counter" aria-live="polite">
        {real + 1} / {n}
      </p>
    </div>
  );
}

export default TaskList;
