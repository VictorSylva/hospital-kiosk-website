import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

export interface DepartmentAttributes {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  current_count: number;
}

export interface DepartmentCreationAttributes extends Optional<DepartmentAttributes, 'id' | 'description' | 'capacity' | 'current_count'> {}
export interface DepartmentInstance extends Model<DepartmentAttributes, DepartmentCreationAttributes>, DepartmentAttributes {}

export const Department = sequelize.define<DepartmentInstance>('Department', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  current_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'departments',
  timestamps: true
});
