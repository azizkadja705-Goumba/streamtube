#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/3474f78f8ebf6966a719dd77aa563aadc4d44d0d12134e3acf9bf85bc4921e6b/contract';
import startContract from '../../snapshots/3474f78f8ebf6966a719dd77aa563aadc4d44d0d12134e3acf9bf85bc4921e6b/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/ed10452ecc0bf3f47a88b45953058ed2a2cbe204ba1e7556cf936104ac2e1ea0/contract';
import endContract from '../../snapshots/ed10452ecc0bf3f47a88b45953058ed2a2cbe204ba1e7556cf936104ac2e1ea0/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('role', 'text', {
          notNull: true,
          default: lit('USER'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'User',
        constraint: 'User_role_check_aff1610c',
        expression:
          "\"role\" IN ('USER', 'CREATOR', 'ARTIST', 'MANAGER', 'LABEL', 'ADMIN', 'OWNER')",
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
