import React, { useEffect } from 'react'
import {
    RowRendererProps,
    Row,
    Position,
} from 'react-data-grid-temp'
import classNames from 'classnames'

import { useStore } from '../store'
import { ColumnProps, TableProps } from '../type'
import { classPrefix } from '../../utils'

import './style/default-row.less'

interface DefaultRowProps extends RowRendererProps<any, unknown> {
    tableProps: TableProps
}

const tableClassPrefix = `${classPrefix}-table`

export const DefaultRow = ({
    row,
    rowIdx,
    eventBus,
    tableProps,
    ...restProps
}: DefaultRowProps) => {
    const store = useStore()
    let columns: ColumnProps[] = []
    if (tableProps.columns){
        columns = tableProps.columns
    }

    const isExpandable = () => {
        if(
            (tableProps.expandable?.rowExpandable?.(row)
            ||
            (tableProps.expandable && tableProps.expandable.expandedRowRender)
            ) &&
            store.expandedRowNumber === rowIdx
        ){
            return true
        }
        return false
    }

    useEffect(() => eventBus.subscribe('SELECT_CELL', (position: Position, openEditor) => {
        if (rowIdx === position.rowIdx) {
            store.setContextMenu({
                row,
                rowIdx,
                openEditor: openEditor === true,
                position,
                column: columns[position.idx] as any,
            })
        }
    }));

    if (row.$type === 'FILL'){
        return (
            <div
                className="rdg-row rdg-row-default-group"
                style={{ top: restProps.top}}
            />
        )
    }

    const height = tableProps.expandable?.height || tableProps.rowHeight! * 6
    const addRowCount = Math.ceil( height/ tableProps.rowHeight!)
    return (
        <>
            <Row
                row={row}
                rowIdx={rowIdx}
                eventBus={eventBus}
                {...restProps}
            />
            {isExpandable() ? (
                <div
                    className={classNames({
                        [`${tableClassPrefix}-expandable`]: true,
                    })}
                    style={{
                        top: restProps.top + tableProps.rowHeight!,
                        width: 'var(--row-width)',
                        height: addRowCount * tableProps.rowHeight!
                    }}
                >
                    {tableProps.expandable?.expandedRowRender?.(row)}
                </div>
            ) : undefined}
            
        </>
    )
}
