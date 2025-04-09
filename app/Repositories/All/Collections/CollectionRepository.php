<?php

namespace App\Repositories\All\Collections;

use App\Models\Collection;
use App\Repositories\Base\BaseRepository;
use App\Repositories\All\Collections\CollectionInterface;

class CollectionRepository extends BaseRepository implements CollectionInterface
{
    /**
     * @var Collection
     */
    protected $model;
    /**
     * CategoryRepository constructor.
     *
     * @param  Collection  $model
     */
    public function __construct(Collection $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }

    /**
     * Get all collections with business relationship.
     *
     * @param array $columns
     * @param array $relations
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function all(array $columns = ['*'], array $relations = []): \Illuminate\Database\Eloquent\Collection
    {
        // Make sure business is always included in relations
        if (!in_array('business', $relations)) {
            $relations[] = 'business';
        }
        
        return $this->model->select($columns)->with($relations)->get();
    }

     /**
     * Find collection by ID with business relationship.
     *
     * @param int $id
     * @return Collection
     */
    public function find($id)
    {
        return $this->model->with('business')->findOrFail($id);
    }

}