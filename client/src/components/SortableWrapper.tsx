import React, {useEffect, useState} from 'react';

/**
 * Wrapper component that enables child components to be reordered (and removed)
 * @param {JSX.Element[]} children - Child components to render
 * @param {Function} callback - Callback function to be called with children keys on order change
 * @param {string} [className] - className property to give to wrapper div
 * @param {any} [style] - Style property to give to wrapper div
 * @return {JSX.Element}
 */
export function SortableWrapper({children, callback, className, style}: {children: JSX.Element[], callback: Function, className?: string, style?: any}) {
  const [sortedChildren, setSortedChildren] = useState<JSX.Element[]>(children);

  // Invoke callback whenever sortedChildren changes
  useEffect(() => {
    callback(sortedChildren.map((child) => child.key));
  }, [sortedChildren]);

  /**
   * Removes a child
   * @param {number} index - Index of element to remove
   */
  function removeChild(index: number) {
    const newSortedChildren = sortedChildren.slice();
    newSortedChildren.splice(index, 1);
    setSortedChildren(newSortedChildren);
  }

  /**
   * Moves a child to a new index
   * @param {number} fromIndex - Index of child to move
   * @param {number} toIndex - New index for child
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

  const sortableComponents = sortedChildren.map((child, index) => {
    return (
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
    );
  });

  return (
    <div className={className} style={style}>
      {sortableComponents}
    </div>
  );
}
