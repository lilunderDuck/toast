import { renamePropDeep } from "~/utils";
import { IBlockData } from "./blockData";

export function compressEditorData(data: IBlockData[]) {
  return renamePropDeep(data, {
    pad: '1',
    border: '2',
    borderStyle: '3',
    borderRadius: '4',
    borderColor: '5',
    text: '6',
    subOrSupscript: '7',
    color: '8',
    bgColor: '9',
    top: '10',
    bottom: '11',
    left: '12',
    right: '13',
    title: '14',
    stuff: '15',
    name: '16',
    id: '17',
    description: '18',
    todo: '19',
    imgName: '20',
    images: '21'
  })
}

export function decompressEditorData(data: IBlockData[]) {
  //@ts-ignore
  return renamePropDeep(data, {
    '1': 'pad',
    '2': 'border',
    '3': 'borderStyle',
    '4': 'borderRadius',
    '5': 'borderColor',
    '6': 'text',
    '7': 'subOrSupscript',
    '8': 'color',
    '9': 'bgColor',
    '10': 'top',
    '11': 'bottom',
    '12': 'left',
    '13': 'right',
    '14': 'title',
    '15': 'stuff',
    '16': 'name',
    '17': 'id',
    '18': 'description',
    '19': 'todo',
    '20': 'imgName',
    '21': 'images'
  })
}