#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/23bd5c0867124915f2b1b65cbecabebc7f4e26898bf2e96e6527fa33f8a930be/contract';
import startContract from '../../snapshots/23bd5c0867124915f2b1b65cbecabebc7f4e26898bf2e96e6527fa33f8a930be/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/d428f552660c3e2a9b47165bbae86923a66095b82e7227ed0436837449f3f270/contract';
import endContract from '../../snapshots/d428f552660c3e2a9b47165bbae86923a66095b82e7227ed0436837449f3f270/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('nik', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
