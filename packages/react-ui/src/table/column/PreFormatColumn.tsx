import React, { useImperativeHandle, useRef } from 'react'
import {
    Column,
    FormatterProps,
    HeaderRendererProps,
    EditorProps,
} from 'react-data-grid-temp'
import { RightOutlined, DownOutlined } from '@ant-design/icons'

import { classPrefix } from '../../utils'
import { Input, Checkbox } from '../../index'
import { Row, TableProps } from '../type'
import { DefaultEditor } from '../editor/DefaultEditor'
import { MultipleSelectColumn } from './MultipleSelectColumn'
import { TableStore, useStore } from '../store'

const tableClassPrefix = `${classPrefix}-table`

export const preFormatColumn = (
    store: TableStore,
    tableProps: TableProps,
) => {
    const columns: Column<Row, unknown>[] = store.columns.filter(
        column => store.visibleColumns?.includes(column.name)
    ).map((element => {
        const { align: colAlign = 'left'} = element
        let bodyTextAlign: 'left' | 'right' | 'center' = 'left'
        let headerTextAlign: 'left' | 'right' | 'center' = 'left'
        const aligns = colAlign.split('|');
        if (aligns.length >= 2) {
            headerTextAlign = aligns[0] as 'left' | 'right' | 'center'
            bodyTextAlign = aligns[1] as 'left' | 'right' | 'center'
        } else if (['left', 'right', 'center'].includes(colAlign)) {
            bodyTextAlign = colAlign as 'left' | 'right' | 'center'
            headerTextAlign = colAlign as 'left' | 'right' | 'center'
        }
        const { 
            name,
            title,
            editor,
            editable,
            formatter,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            align,
            headerRenderer = ({ column }: HeaderRendererProps<Row, unknown>) => (
                <div style={{ textAlign: headerTextAlign }}>{column.name}</div>
            ),
            ...restProps
        } = element
        const TempEditor = editable ? editor || Input : undefined



        let format = (cellProps: FormatterProps) => (
            <div
                className={`${tableClassPrefix}-cell`}
                style={{
                    textAlign: bodyTextAlign,
                }}>
                {cellProps.row[cellProps.column.key]}
            </div>
        )
        if (formatter) {
            const Formatter = formatter
            // 如果字符串不超过对应的长度,则使用默认的div
            format = (cellProps: FormatterProps) => (
                <div
                    className={`${tableClassPrefix}-cell`}
                    style={{
                        textAlign: bodyTextAlign,
                    }}>
                    {
                        cellProps.row.$type ? (
                            cellProps.row[cellProps.column.key]
                        ) : (
                            <Formatter {...cellProps} />
                        )}
                </div>
            )
        }

        return {
            key: name,
            name: title,
            resizable: true,
            formatter: format,
            editable,
            headerRenderer,
            editor: TempEditor ? React.forwardRef((
                eProps: EditorProps<Row[keyof Row], Row, unknown>,
                ref,
            ) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const domRef = useRef<any>(null);
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useImperativeHandle(ref, () => ({
                    getValue: () => domRef.current.getValue(),
                    getInputNode: () => domRef.current.getInputNode(),
                }))
                return (
                    <DefaultEditor
                        ref={domRef}
                        // @ts-ignore
                        node={TempEditor}
                        extProps={eProps}
                    />
                )
            }) as React.ComponentType<EditorProps<Row[keyof Row], Row, unknown>> : undefined,
            ...restProps,
        }
    }))
    if (tableProps.selectBox !== 'none') {
        const select: Column<Row, unknown> = {
            key: '$select',
            name: '',
            frozen: true,
            selectCell: false,
            maxWidth: 35,
            formatter: tableProps.selectRenderer ?? MultipleSelectColumn,
            headerRenderer: tableProps.selectBox === 'multiple' ? () => {
                const SelectHeaderRenderer = tableProps.selectHeaderRenderer || Checkbox
                return (
                    <SelectHeaderRenderer
                        checked={(
                            store.selectedRows.size === store.datas.length
                            &&
                            store.datas.length !== 0
                        )}
                        onChange={e => {
                            const selectKeys = new Set<Row[keyof Row]>()
                            if (e.target.checked) {
                                store.datas.forEach((ele: any) => {
                                    const value = ele[tableProps.rowKey!] as Row[keyof Row]
                                    selectKeys.add(value)
                                })
                            }
                            store.setSelectedRows(selectKeys, tableProps.onSelectedRowsChange)
                        }}
                    />
                )
            } : undefined,
        }
        columns.splice(0, 0, select)
    }

    if (tableProps.expandable?.expandedRowRender) {
        const expandable: Column<Row, unknown> = {
            key: '$expandable',
            name: '',
            frozen: true,
            maxWidth: 35,
            selectCell: false,
            formatter: formatterProps => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const globalStore = useStore()
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const Icon = globalStore.expandedRowNumber === formatterProps.rowIdx ? DownOutlined : RightOutlined
                const nodeIcon = (
                    <Icon
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => {
                            // 要添加的条目数
                            const height = tableProps.expandable?.height || tableProps.rowHeight! * 6
                            const addRowCount = Math.ceil(height / tableProps.rowHeight!)
                            if (globalStore.expandedRowNumber === formatterProps.rowIdx ){
                                globalStore.setExpandedRowNumber(-1, addRowCount)
                            }else {
                                globalStore.setExpandedRowNumber(formatterProps.rowIdx, addRowCount)
                            }
                        }}
                    />
                )
                const isRowExpandable = tableProps.expandable?.rowExpandable?.(formatterProps.row)
                if (
                    isRowExpandable || isRowExpandable === undefined
                ){
                    return nodeIcon;
                }
                return null;
            }
        }
        columns.splice(0, 0, expandable)
    }
    return columns
}
