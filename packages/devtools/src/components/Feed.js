//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';
import clsx from 'clsx';
import ColorHash from 'color-hash';

import { makeStyles } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import blue from '@material-ui/core/colors/blue';

import { truncateString } from '@dxos/debug';
import JsonTreeView from '@dxos/react-ux/dist/es/components/JsonTreeView';

const colorHash = new ColorHash({ saturation: 1 });

const useStyles = makeStyles(() => ({
  system: {
    backgroundColor: red[50]
  },

  outerCell: {
    verticalAlign: 'top'
  },

  innerCell: {
    verticalAlign: 'top'
  },

  block: {},

  meta: {
    fontSize: 14,
    fontFamily: 'monospace'
  }
}));

const color = (type) => {
  return type.indexOf('dxos') !== -1 ? red[500] : blue[500];
};

const Feed = ({ messages, onSelect }) => {
  const classes = useStyles();

  // Dynamically expand for performance.
  const [expanded, setExpanded] = useState({});
  const handleExpand = (rowKey) => {
    setExpanded({ ...expanded, ...{ [rowKey]: true } });
  };

  return (
    <TableContainer>
      <Table stickyHeader size='small'>
        <TableHead>
          <TableRow>
            <TableCell className={classes.outerCell}>Feed</TableCell>
            <TableCell className={classes.outerCell}>#</TableCell>
            <TableCell className={classes.outerCell}>Type</TableCell>
            <TableCell className={classes.outerCell} style={{ width: '60%' }}>Payload</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // Messages with feed metadata.
            messages.map(({ key, seq, data }) => {
              const { timestamp, __type_url: type, ...rest } = data;

              const feedKey = key;

              const rowKey = `key-${feedKey}-${seq}`;

              return (
                <TableRow key={rowKey} size='small' className={clsx({ [classes.system]: type.indexOf('dxos') !== -1 })}>
                  {/* Feed */}
                  <TableCell
                    className={clsx(classes.outerCell, classes.meta)}
                    style={{ color: colorHash.hex(feedKey) }}
                    title={feedKey}
                  >
                    {truncateString(feedKey, 8)}
                  </TableCell>

                  {/* # */}
                  <TableCell className={clsx(classes.outerCell, classes.block)}>{seq}</TableCell>

                  {/* Type */}
                  <TableCell className={classes.outerCell}>
                    <Link
                      style={{ color: color(type), cursor: 'pointer' }}
                      onClick={() => onSelect(data, type)}
                    >
                      {type}
                    </Link>
                  </TableCell>

                  {/* Payload */}
                  {/* TODO(burdon): Custom rendering of links for public keys. */}
                  <TableCell className={classes.outerCell}>
                    <JsonTreeView
                      size='small'
                      root='data'
                      depth={0}
                      data={expanded[rowKey] ? rest : { dummy: undefined }}
                      onSelect={() => handleExpand(rowKey)}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Feed;
