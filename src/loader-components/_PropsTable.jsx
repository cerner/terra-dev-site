/* eslint-disable react/forbid-dom-props */
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ThemeContext } from 'terra-application/lib/theme';
import styles from './PropsTable.module.scss';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * The props table rows.
   */
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.func,
      required: PropTypes.bool,
      defaultValue: PropTypes.string,
      description: PropTypes.func,
    }),
  ),
};

const PropsTable = ({ rows }) => {
  const theme = useContext(ThemeContext);

  return (
    <table className={cx('table', theme.className)}>
      <thead>
        <tr className={cx('tr')}>
          <th className={cx('th')}>
            Prop Name
          </th>
          <th className={cx('th')}>
            Type
          </th>
          <th className={cx('th')}>
            Is Required
          </th>
          <th className={cx('th')}>
            Default Value
          </th>
          <th className={cx('th')}>
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr className={cx('tr', 'props-tr')} key={row.name}>
            <td className={cx(['td', 'strong', 'props-td'])}>
              {row.name}
            </td>
            <td className={cx(['td', 'props-td'])}>
              {row.type()}
            </td>
            <td
              className={cx([
                'td',
                'props-td',
                row.required ? ['required'] : [],
              ])}
            >
              {row.required ? 'required' : 'optional'}
            </td>
            <td className={cx(['td', 'props-td'])}>
              {row.defaultValue}
            </td>
            <td className={cx(['td', 'props-td'])}>
              {row.description()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

PropsTable.propTypes = propTypes;

export default PropsTable;
