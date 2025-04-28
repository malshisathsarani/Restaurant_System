<?php

namespace App\Repositories\All\Collections;

use App\Repositories\Base\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

interface CollectionInterface extends BaseRepositoryInterface
{
    /**
     * Get collections by business IDs with specified relations.
     *
     * @param array $businessIds
     * @param array $columns
     * @param array $relations
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): Collection;
}