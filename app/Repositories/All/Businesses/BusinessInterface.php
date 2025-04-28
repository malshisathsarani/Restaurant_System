<?php

namespace App\Repositories\All\Businesses;

use App\Repositories\Base\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface BusinessInterface extends BaseRepositoryInterface
{
    public function findByIdWithRelations(int $id, array $relations);
    
    /**
     * Get businesses by their IDs, with optional columns & relations.
     */
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): Collection;
}
