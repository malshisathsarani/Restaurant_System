<?php

namespace App\Repositories\All\Businesses;

use App\Models\Business;
use App\Repositories\Base\BaseRepository;

class BusinessRepository extends BaseRepository implements BusinessInterface
{
    /**
     * @var Business
     */
    protected $model;
    /**
     * BussinessRepository constructor.
     *
     * @param  Business  $model
     */
    public function __construct(Business $model)
    {
        $this->model = $model;
    }

    public function findByIdWithRelations(int $id, array $relations)
    {
        return Business::with($relations)->findOrFail($id);
    }
    

}
