<?php

namespace App\Repositories\All\Businesses;

use App\Models\Business;
use App\Repositories\Base\BaseRepository;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;

class BusinessRepository extends BaseRepository implements BusinessInterface
{
    protected $model;

    public function __construct(Business $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }

    public function findByIdWithRelations(int $id, array $relations)
    {
        return $this->model->with($relations)->findOrFail($id);
    }
    
    public function getByBusinessIds(array $businessIds, array $columns = ['*'], array $relations = []): EloquentCollection
    {
        // eager-load users or other relations if needed
        return $this->model
                    ->select($columns)
                    ->with($relations)
                    ->whereIn('id', $businessIds)
                    ->get();
    }
}
