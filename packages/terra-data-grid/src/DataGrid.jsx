import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import ContentContainer from 'terra-content-container';
import { DraggableCore } from 'react-draggable';

import styles from './DataGrid.scss';

const cx = classNames.bind(styles);

const propTypes = {
  test: PropTypes.string,
};

const CustomCell = ({ text }) => (
  <div className={cx('custom-cell')}>
    {text}
  </div>
);

class DataGrid extends React.Component {
  constructor(props) {
    super(props);

    this.updateWidths = this.updateWidths.bind(this);
    this.handleHorizontalScroll = this.handleHorizontalScroll.bind(this);


    const fixedColumnWidth = props.fixedColumnKeys.map(key => props.columns[key].startWidth).reduce((totalWidth, width) => totalWidth + width);

    const columnWidths = {};
    Object.keys(props.columns).forEach((columnKey) => {
      columnWidths[columnKey] = props.columns[columnKey].startWidth;
    });

    this.state = {
      fixedColumnWidth,
      columnWidths,
    };
  }

  componentDidMount() {
    this.verticalOverflowContainer.addEventListener('scroll', this.handleHorizontalScroll);
  }

  componentWillUnmount() {
    this.verticalOverflowContainer.removeEventListener('scroll', this.handleHorizontalScroll);
  }

  handleHorizontalScroll() {
    if (!this.isScrolling) {
      this.isScrolling = true;

      this.overflowHeaderContainer.style.display = 'none';
      this.fixedHeaderContainer.style.display = 'block';

      this.fixedOverflowContainer.scrollLeft = this.horizontalOverflowContainer.scrollLeft;
    }

    if (this.verticalScrollTimeout) {
      clearTimeout(this.verticalScrollTimeout);
    }

    this.verticalScrollTimeout = setTimeout(() => {
      this.fixedHeaderContainer.style.display = 'none';

      this.overflowHeaderContainer.style.display = 'block';
      this.overflowHeaderContainer.style.position = 'relative';
      this.overflowHeaderContainer.style.top = `${this.verticalOverflowContainer.scrollTop}px`;

      this.fixedOverflowContainer.scrollLeft = this.horizontalOverflowContainer.scrollLeft;

      this.isScrolling = false;
    }, 100);
  }

  updateWidths(columnKey, widthDelta) {
    const columnWidths = Object.assign({}, this.state.columnWidths);
    if (columnWidths[columnKey] + widthDelta < 50) {
      columnWidths[columnKey] = 50;
    } else {
      columnWidths[columnKey] += widthDelta;
    }

    const fixedColumnWidth = this.props.fixedColumnKeys.map(key => columnWidths[key]).reduce((totalWidth, width) => totalWidth + width);

    this.setState({
      fixedColumnWidth,
      columnWidths,
    });
  }

  render() {
    const { columns, rows, fixedColumnKeys, flexColumnKeys, rowSize } = this.props;

    const fixedColumnWidth = this.state.fixedColumnWidth;

    const headerRow = (
      <div className={cx(['row', 'header-row'])}>
        <div className={cx(['fixed-column-container'])} style={{ width: `${fixedColumnWidth}px` }}>
          {fixedColumnKeys.map((columnKey) => {
            const columnData = columns[columnKey];

            return (
              <div className={cx(['header-cell', 'selectable'])} style={{ width: `${this.state.columnWidths[columnKey]}px` }} tabIndex="0">
                <CustomCell text={columnData.title} />
                <DraggableCore
                  handle=".drag-handle"
                  onStart={(event, data) => {
                    data.node.classList.add(cx('react-draggable-dragging'));
                    this.scrollPosition = 0;
                  }}
                  onStop={(event, data) => {
                    data.node.classList.remove(cx('react-draggable-dragging'));
                    data.node.style.transform = '';
                    this.updateWidths(columnKey, this.scrollPosition);
                  }}
                  onDrag={(event, data) => {
                    this.scrollPosition += data.deltaX;
                    data.node.style.transform = `translate3d(${this.scrollPosition}px, 0, 100px)`;
                  }}
                >
                  <div className={cx(['drag-header', 'drag-handle'])}>
                    <div className={cx('inner-drag')} />
                  </div>
                </DraggableCore>
              </div>
            );
          })}
        </div>
        {flexColumnKeys.map((columnKey) => {
          const columnData = columns[columnKey];

          return (
            <div className={cx(['header-cell', 'selectable'])} style={{ width: `${this.state.columnWidths[columnKey]}px` }} tabIndex="0">
              <CustomCell text={columnData.title} />
              <DraggableCore
                handle=".drag-handle"
                onStart={(event, data) => {
                  data.node.classList.add(cx('react-draggable-dragging'));
                  this.scrollPosition = 0;
                }}
                onStop={(event, data) => {
                  data.node.classList.remove(cx('react-draggable-dragging'));
                  data.node.style.transform = '';
                  this.updateWidths(columnKey, this.scrollPosition);
                }}
                onDrag={(event, data) => {
                  this.scrollPosition += data.deltaX;
                  data.node.style.transform = `translate3d(${this.scrollPosition}px, 0, 100px)`;
                }}
              >
                <div className={cx(['drag-header', 'drag-handle'])}>
                  <div className={cx('inner-drag')} />
                </div>
              </DraggableCore>
            </div>
          );
        })}
        <div className={cx('buffer-cell', 'buffer-header-cell')} />
      </div>
    );

    const contentRows = rows.map((row, index) => {
      const fixedColumnRowData = [];
      fixedColumnKeys.forEach(fixedColumnKey => (
        fixedColumnRowData.push(row[fixedColumnKey])
      ));

      const flexColumnRowData = [];
      flexColumnKeys.forEach(flexColumnKey => (
        flexColumnRowData.push(row[flexColumnKey])
      ));

      return (
        <div className={cx(['row', { 'stripe-row': index % 2 > 0 }])}>
          <div className={cx(['fixed-column-container'])} style={{ width: `${fixedColumnWidth}px` }}>
            {fixedColumnKeys.map((columnKey) => {
              const columnData = columns[columnKey];
              const rowData = row[columnKey];

              return (
                <div className={cx(['cell', 'selectable'])} style={{ width: `${this.state.columnWidths[columnKey]}px` }} tabIndex="0">
                  <CustomCell text={rowData.title} />
                </div>
              );
            })}
          </div>
          {flexColumnKeys.map((columnKey) => {
            const columnData = columns[columnKey];
            const rowData = row[columnKey];

            return (
              <div className={cx(['cell', 'selectable'])} style={{ width: `${this.state.columnWidths[columnKey]}px` }} tabIndex="0">
                <CustomCell text={rowData.title} />
              </div>
            );
          })}
          <div className={cx('buffer-cell')} />
        </div>
      );
    });

    return (
      <ContentContainer
        header={(
          <div className={cx(['container'])}>
            <div ref={(ref) => { this.fixedOverflowContainer = ref; }} className={cx(['wrapper'])} style={{ marginLeft: `${fixedColumnWidth}px`, overflow: 'hidden' }}>
              <div ref={(ref) => { this.fixedHeaderContainer = ref; if (ref) { this.fixedHeaderContainer.style.display = 'none'; } }}>
                {headerRow}
              </div>
            </div>
          </div>
        )}
        fill
      >
        <div ref={(ref) => { this.verticalOverflowContainer = ref; }} className={cx(['container'])}>
          <div style={{ position: 'absolute', left: '0', top: '0', width: `${fixedColumnWidth}px`, display: 'flex' }}>
            {fixedColumnKeys.map((columnKey) => {
              const columnData = columns[columnKey];

              return (
                <div className={cx(['header-cell', 'selectable'])} style={{ width: `${this.state.columnWidths[columnKey]}px` }} tabIndex="0">
                  <CustomCell text={columnData.title} />
                  <DraggableCore
                    handle=".drag-handle"
                    onStart={(event, data) => {
                      data.node.classList.add(cx('react-draggable-dragging'));
                      this.scrollPosition = 0;
                    }}
                    onStop={(event, data) => {
                      data.node.classList.remove(cx('react-draggable-dragging'));
                      data.node.style.transform = '';
                      this.updateWidths(columnKey, this.scrollPosition);
                    }}
                    onDrag={(event, data) => {
                      this.scrollPosition += data.deltaX;
                      data.node.style.transform = `translate3d(${this.scrollPosition}px, 0, 100px)`;
                    }}
                  >
                    <div className={cx(['drag-header', 'drag-handle'])}>
                      <div className={cx('inner-drag')} />
                    </div>
                  </DraggableCore>
                </div>
              );
            })}
          </div>
          <div ref={(ref) => { this.horizontalOverflowContainer = ref; }} className={cx(['wrapper'])} style={{ marginLeft: `${fixedColumnWidth}px` }}>
            <div ref={(ref) => { this.overflowHeaderContainer = ref; }}>
              {headerRow}
            </div>
            {contentRows}
          </div>
        </div>
      </ContentContainer>
    );
  }
}

DataGrid.propTypes = propTypes;

export default DataGrid;