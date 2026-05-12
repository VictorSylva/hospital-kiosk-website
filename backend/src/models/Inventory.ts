import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface InventoryAttributes {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  expiry_date: Date | null;
}

export interface InventoryCreationAttributes extends Optional<InventoryAttributes, 'id' | 'quantity' | 'reorder_level' | 'expiry_date'> {}
export interface InventoryInstance extends Model<InventoryAttributes, InventoryCreationAttributes>, InventoryAttributes {}

export const Inventory = sequelize.define<InventoryInstance>('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reorder_level: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  expiry_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'inventory',
  timestamps: true
});
