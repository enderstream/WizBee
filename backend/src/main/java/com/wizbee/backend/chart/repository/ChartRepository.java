package com.wizbee.backend.chart.repository;

import com.wizbee.backend.chart.entity.Chart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChartRepository extends JpaRepository<Chart, Long> {

//    public List<Chart> findByDate ();

}
