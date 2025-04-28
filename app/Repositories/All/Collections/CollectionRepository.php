<?php

namespace App\Repositories\All\Collections;

use App\Models\Collection;
use App\Repositories\Base\BaseRepository;
use App\Repositories\All\Collections\CollectionInterface;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class CollectionRepository extends BaseRepository implements CollectionInterface
{
    /**
     * @var Collection
     */
    protected $model;

    /**
     * CollectionRepository constructor.
     *
     * @param Collection $model
     */
    public function __construct(Collection $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }

    /**
     * Get collections by business IDs with specified relations.
     *
     * @param array $businessIds
     * @param array $columns
     * @param array $relations
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): EloquentCollection
    {
        // Ensure 'business' is included in relations for consistency
        if (!in_array('business', $relations)) {
            $relations[] = 'business';
        }

        return $this->model->select($columns)
                           ->with($relations)
                           ->whereIn('business_id', $businessIds)
                           ->get();
    }

    
}