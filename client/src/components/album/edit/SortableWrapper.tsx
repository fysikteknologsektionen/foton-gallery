import React, {Key, useEffect, useState} from 'react';

/**
 * Wrapper component that enables child components to be reordered (and removed)
 * @param children Children components
 * @param callback Callback function for when order of children changes
 * @param className className property to pass to wrapper div
 * @param style Style property to pass to wrapper div
 * @return React component
 */
export function SortableWrapper({children, callback, className, style}: {
  children: JSX.Element[],
  callback(childrenKeys: string[]): void,
  className?: string,
  style?: any
  }) {
  const [sortedChildren, setSortedChildren] = useState<JSX.Element[]>(children);

  // Invoke callback when sortedChildren changes
  useEffect(() => {
    // Only call if there has actually been a change
    if (sortedChildren !== children) {
      callback(
          sortedChildren
              .map((child) => child.key)
              .filter((value): value is Key => value !== null) as string[],
      );
    }
  }, [sortedChildren]);

  /**
   * Removes a child
   * @param index Index of element to remove
   */
  function removeChild(index: number) {
    const newSortedChildren = sortedChildren.slice();
    newSortedChildren.splice(index, 1);
    setSortedChildren(newSortedChildren);
  }

  /**
   * Moves a child to a new index
   * @param fromIndex Index of child to move
   * @param toIndex New index for child
   */
  function moveChild(fromIndex: number, toIndex: number) {
    // Do nothing if we are trying to move to an invalid index
    if (toIndex < 0 || toIndex > sortedChildren.length-1) {
      return;
    }
    const newSortedChildren = sortedChildren.slice();
    const fromElement = newSortedChildren[fromIndex];
    const toElement = newSortedChildren[toIndex];
    newSortedChildren.splice(fromIndex, 1, toElement);
    newSortedChildren.splice(toIndex, 1, fromElement);
    setSortedChildren(newSortedChildren);
  }

  return (
    <div className={className} style={style}>
      {
        sortedChildren.map((child, index) => (
          <div key={child.key}>
            <div className="position-relative">
              {child}
              <button
                className="position-absolute btn btn-primary"
                style={{left: 0, top: '50%'}}
                type="button"
                onClick={() => moveChild(index, index-1)}
              >
                <i className="bi-arrow-left"/>
              </button>
              <button
                className="position-absolute btn btn-primary"
                style={{right: 0, top: '50%'}}
                type="button"
                onClick={() => moveChild(index, index+1)}
              >
                <i className="bi-arrow-right"/>
              </button>
              <button
                className="position-absolute btn btn-danger"
                style={{right: 0, top: 0}}
                type="button"
                onClick={() => removeChild(index)}
              >
                <i className="bi-x"/>
              </button>
            </div>
          </div>
        ))
      }
    </div>
  );
}
