<?php

namespace App\Repositories\All\Items;

use App\Repositories\Base\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface ItemInterface extends BaseRepositoryInterface
{
    /**
     * Get items by business IDs with specified relations.
     *
     * @param array $businessIds
     * @param array $columns
     * @param array $relations
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): Collection;
}
