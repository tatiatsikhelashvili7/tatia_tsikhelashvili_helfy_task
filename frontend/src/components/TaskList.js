import React, { useEffect, useState, useRef } from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  const [current, setCurrent] = useState(1);
  const [animate, setAnimate] = useState(true);
  const wrapping = useRef(false);

  const n = tasks.length;
  const ids = tasks.map(function (t) {
    return t.id;
  }).join(',');

  useEffect(() => {
    setAnimate(false);
    if (n > 1) {
      setCurrent(1);
    } else {
      setCurrent(0);
    }
    const t = setTimeout(function () {
      setAnimate(true);
    }, 30);
    return function () {
      clearTimeout(t);
    };
  }, [n, ids]);

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
    if (e.target !== e.currentTarget) {
      return;
    }
    if (n < 2) {
      return;
    }

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
        <p className="gray">Add a task or change the filter.</p>
      </div>
    );
  }

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

  let trans = 'none';
  if (animate && n > 1) {
    trans = 'transform 0.5s ease-in-out';
  }

  const style = {
    transform: 'translateX(-' + pos * 100 + '%)',
    transition: trans
  };

  return (
    <div className="carousel">
      <div className="carousel-row">
        <button type="button" className="arrow" onClick={prev} disabled={n < 2}>
          {'‹'}
        </button>

        <div className="viewport">
          <div className="track" style={style} onTransitionEnd={onEnd}>
            {slides.map(function (task, i) {
              return (
                <div className="slide" key={task.id + '-' + i}>
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

        <button type="button" className="arrow" onClick={next} disabled={n < 2}>
          {'›'}
        </button>
      </div>

      <div className="dots">
        {tasks.map(function (task, i) {
          return (
            <button
              key={task.id}
              type="button"
              className={i === real ? 'dot on' : 'dot'}
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

      <p className="counter">
        {real + 1} / {n}
      </p>
    </div>
  );
}

export default TaskList;
